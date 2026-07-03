package com.lattix.gateway.ratelimit;

import com.lattix.gateway.config.GatewayProperties;
import org.junit.jupiter.api.Test;

import java.net.URI;
import java.time.Duration;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class GatewayRateLimitServiceTest {

    @Test
    void deniesRequestsAfterLimitIsExceeded() {
        GatewayProperties properties = new GatewayProperties(
                new GatewayProperties.Security("https://auth.lattix.local", "lattix-api", "secret", List.of("/actuator/health/**")),
                new GatewayProperties.RateLimit("memory", 1, 1, 1, 1, Duration.ofMinutes(1)),
                new GatewayProperties.Validation(1024, List.of("application/json"), List.of("GET")),
                List.of(new GatewayProperties.ServiceRoute("search", "search-service", "/api/v1/search/**", URI.create("http://localhost"), true, List.of(), 3, 0, Duration.ofSeconds(5), 2))
        );
        GatewayRateLimitService service = new GatewayRateLimitService(properties, new InMemoryGatewayRateLimitStore());
        RateLimitRequest request = new RateLimitRequest("user-1", "workspace-1", "token-1", "127.0.0.1", "search", 1);

        assertThat(service.evaluate(null, request).block().allowed()).isTrue();
        assertThat(service.evaluate(null, request).block().allowed()).isFalse();
    }
}
