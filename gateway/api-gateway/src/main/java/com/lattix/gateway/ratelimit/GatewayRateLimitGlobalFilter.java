package com.lattix.gateway.ratelimit;

import com.lattix.gateway.audit.AccessDecision;
import com.lattix.gateway.audit.GatewayAuditEvent;
import com.lattix.gateway.audit.GatewayAuditPublisher;
import com.lattix.gateway.errors.GatewayErrorWriter;
import com.lattix.gateway.errors.GatewayFailure;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils;
import org.springframework.core.Ordered;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Optional;

public class GatewayRateLimitGlobalFilter implements GlobalFilter, Ordered {
    private final GatewayRateLimitService rateLimitService;
    private final GatewayErrorWriter errorWriter;
    private final GatewayAuditPublisher auditPublisher;

    public GatewayRateLimitGlobalFilter(GatewayRateLimitService rateLimitService,
                                        GatewayErrorWriter errorWriter,
                                        GatewayAuditPublisher auditPublisher) {
        this.rateLimitService = rateLimitService;
        this.errorWriter = errorWriter;
        this.auditPublisher = auditPublisher;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        if (exchange.getRequest().getPath().value().startsWith("/internal/gateway/")) {
            return chain.filter(exchange);
        }
        return exchange.getPrincipal()
                .map(Authentication.class::cast)
                .defaultIfEmpty(new JwtAuthenticationToken(
                        new org.springframework.security.oauth2.jwt.Jwt("none", Instant.now(), Instant.now().plusSeconds(60),
                                java.util.Map.of("alg", "none"), java.util.Map.of("sub", "anonymous")),
                        java.util.List.of()))
                .flatMap(principal -> evaluate(exchange, chain, principal));
    }

    private Mono<Void> evaluate(ServerWebExchange exchange, GatewayFilterChain chain, Authentication authentication) {
        GatewayPropertiesExtractor extractor = new GatewayPropertiesExtractor(exchange);
        RateLimitRequest request = extractor.toRateLimitRequest(authentication);
        return rateLimitService.evaluate(authentication, request)
                .flatMap(decision -> {
                    String routeId = extractor.routeId();
                    auditPublisher.publish(GatewayAuditEvent.from(exchange, decision.allowed() ? AccessDecision.granted() : AccessDecision.denied(decision.reason()), request.actorId(), request.ip(), Instant.now()));
                    if (!decision.allowed()) {
                        return errorWriter.write(exchange, new GatewayFailure(org.springframework.http.HttpStatus.TOO_MANY_REQUESTS, "RATE_LIMIT_EXCEEDED",
                                "Request rate limit exceeded", true,
                                java.util.Map.of("remaining", decision.remaining(), "resetAt", decision.resetAt(), "route", routeId)));
                    }
                    return chain.filter(exchange);
                });
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 20;
    }

    private static final class GatewayPropertiesExtractor {
        private final ServerWebExchange exchange;

        private GatewayPropertiesExtractor(ServerWebExchange exchange) {
            this.exchange = exchange;
        }

        private String routeId() {
            Object route = exchange.getAttribute(ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR);
            if (route instanceof org.springframework.cloud.gateway.route.Route gatewayRoute) {
                return gatewayRoute.getId();
            }
            return route == null ? "unknown" : route.toString();
        }

        private RateLimitRequest toRateLimitRequest(Authentication authentication) {
            String actorId = authentication == null ? null : authentication.getName();
            String workspaceId = exchange.getRequest().getHeaders().getFirst("X-Workspace-Id");
            String tokenId = authentication instanceof JwtAuthenticationToken jwtAuth ? jwtAuth.getToken().getId() : null;
            String ip = Optional.ofNullable(exchange.getRequest().getHeaders().getFirst("X-Forwarded-For"))
                    .orElseGet(() -> Optional.ofNullable(exchange.getRequest().getRemoteAddress())
                            .map(address -> address.getAddress().getHostAddress())
                            .orElse("127.0.0.1"));
            int cost = Optional.ofNullable(exchange.getAttribute(ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR))
                    .map(Object::toString)
                    .map(route -> route.contains("analytics") ? 3 : 1)
                    .orElse(1);
            return new RateLimitRequest(actorId, workspaceId, tokenId, ip, routeId(), cost);
        }
    }
}
