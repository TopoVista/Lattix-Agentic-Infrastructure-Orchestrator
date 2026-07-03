package com.lattix.gateway.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.net.URI;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@ConfigurationProperties(prefix = "lattix.gateway")
public record GatewayProperties(
        Security security,
        RateLimit rateLimit,
        Validation validation,
        List<ServiceRoute> routes) {

    public GatewayProperties {
        security = security == null ? new Security(null, null, null, null) : security;
        rateLimit = rateLimit == null ? new RateLimit(null, 0, 0, 0, 0, null) : rateLimit;
        validation = validation == null ? new Validation(0, null, null) : validation;
        routes = routes == null ? List.of() : List.copyOf(routes);
    }

    public record Security(
            String issuerUri,
            String audience,
            String sharedSecret,
            List<String> publicPaths) {

        public Security {
            publicPaths = publicPaths == null || publicPaths.isEmpty()
                    ? List.of("/actuator/health/**", "/actuator/info")
                    : List.copyOf(publicPaths);
        }
    }

    public record RateLimit(
            String backend,
            int defaultPerMinute,
            int perWorkspacePerMinute,
            int perTokenPerMinute,
            int perIpPerMinute,
            Duration window) {

        public RateLimit {
            backend = backend == null ? "memory" : backend;
            defaultPerMinute = defaultPerMinute > 0 ? defaultPerMinute : 600;
            perWorkspacePerMinute = perWorkspacePerMinute > 0 ? perWorkspacePerMinute : 2400;
            perTokenPerMinute = perTokenPerMinute > 0 ? perTokenPerMinute : 1200;
            perIpPerMinute = perIpPerMinute > 0 ? perIpPerMinute : 240;
            window = window == null ? Duration.ofMinutes(1) : window;
        }
    }

    public record Validation(
            int maxPayloadBytes,
            List<String> allowedContentTypes,
            List<String> allowedMethods) {

        public Validation {
            maxPayloadBytes = maxPayloadBytes > 0 ? maxPayloadBytes : 1_048_576;
            allowedContentTypes = allowedContentTypes == null || allowedContentTypes.isEmpty()
                    ? List.of("application/json", "application/merge-patch+json", "application/x-www-form-urlencoded",
                    "multipart/form-data")
                    : List.copyOf(allowedContentTypes);
            allowedMethods = allowedMethods == null || allowedMethods.isEmpty()
                    ? List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD")
                    : List.copyOf(allowedMethods);
        }
    }

    public record ServiceRoute(
            String id,
            String serviceName,
            String path,
            URI uri,
            boolean authRequired,
            List<String> scopes,
            int stripPrefix,
            int retries,
            Duration timeout,
            int cost) {

        public ServiceRoute {
            scopes = scopes == null ? List.of() : List.copyOf(new ArrayList<>(scopes));
            stripPrefix = stripPrefix > 0 ? stripPrefix : 3;
            retries = Math.max(retries, 0);
            timeout = timeout == null ? Duration.ofSeconds(8) : timeout;
            cost = Math.max(cost, 1);
        }
    }
}
