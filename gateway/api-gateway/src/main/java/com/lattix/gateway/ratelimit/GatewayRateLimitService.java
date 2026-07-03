package com.lattix.gateway.ratelimit;

import com.lattix.gateway.config.GatewayProperties;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Locale;
import java.util.Objects;

public class GatewayRateLimitService {
    private final GatewayProperties properties;
    private final GatewayRateLimitStore store;

    public GatewayRateLimitService(GatewayProperties properties, GatewayRateLimitStore store) {
        this.properties = properties;
        this.store = store;
    }

    public Mono<RateLimitDecision> evaluate(Authentication authentication, RateLimitRequest request) {
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();
            String workspace = jwt.getClaimAsString("workspace_id");
            if (workspace != null && request.workspaceId() == null) {
                request = new RateLimitRequest(request.actorId(), workspace, request.tokenId(), request.ip(), request.route(), request.cost());
            }
        }

        return evaluateChecks(new Check[] {
                new Check(key("route", request.route()), properties.rateLimit().defaultPerMinute()),
                request.actorId() == null ? null : new Check(key("user", request.actorId()), properties.rateLimit().defaultPerMinute()),
                request.workspaceId() == null ? null : new Check(key("workspace", request.workspaceId()), properties.rateLimit().perWorkspacePerMinute()),
                request.tokenId() == null ? null : new Check(key("token", request.tokenId()), properties.rateLimit().perTokenPerMinute()),
                new Check(key("ip", request.ip()), properties.rateLimit().perIpPerMinute())
        }, request.cost());
    }

    private Mono<RateLimitDecision> evaluateChecks(Check[] checks, int cost) {
        Mono<RateLimitDecision> result = Mono.just(new RateLimitDecision(true, properties.rateLimit().defaultPerMinute(), Instant.now().plus(properties.rateLimit().window()), "allowed"));
        for (Check check : checks) {
            if (check == null) {
                continue;
            }
            result = result.flatMap(current -> {
                if (!current.allowed()) {
                    return Mono.just(current);
                }
                return store.increment(check.key(), properties.rateLimit().window(), cost)
                    .map(count -> {
                        long remaining = Math.max(0, check.limit() - count);
                        if (count > check.limit()) {
                            return new RateLimitDecision(false, remaining, Instant.now().plus(properties.rateLimit().window()), check.key() + "_limit_exceeded");
                        }
                        return new RateLimitDecision(true, remaining, Instant.now().plus(properties.rateLimit().window()), current.reason());
                    });
            });
        }
        return result;
    }

    private String key(String prefix, String value) {
        return "lattix:gateway:rate-limit:%s:%s".formatted(prefix, value.toLowerCase(Locale.ROOT));
    }

    private record Check(String key, int limit) {
    }
}
