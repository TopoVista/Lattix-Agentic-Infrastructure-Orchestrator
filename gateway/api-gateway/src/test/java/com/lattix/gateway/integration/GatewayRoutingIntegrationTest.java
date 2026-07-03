package com.lattix.gateway.integration;

import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
class GatewayRoutingIntegrationTest {

    private static MockWebServer backend;

    @LocalServerPort
    int port;

    @Autowired
    private WebTestClient client;

    @BeforeAll
    static void startBackend() throws IOException {
        backend = new MockWebServer();
        backend.start();
    }

    @AfterAll
    static void stopBackend() throws IOException {
        backend.shutdown();
    }

    @DynamicPropertySource
    static void registerProperties(DynamicPropertyRegistry registry) {
        registry.add("LATTIX_GATEWAY_ROUTE_BASE_URI", () -> backend.url("/").toString());
        registry.add("lattix.gateway.rate-limit.backend", () -> "memory");
        registry.add("lattix.gateway.rate-limit.default-per-minute", () -> "1");
        registry.add("lattix.gateway.rate-limit.per-workspace-per-minute", () -> "10");
        registry.add("lattix.gateway.rate-limit.per-token-per-minute", () -> "10");
        registry.add("lattix.gateway.rate-limit.per-ip-per-minute", () -> "10");
        registry.add("lattix.gateway.security.shared-secret", () -> "01234567890123456789012345678901");
    }

    @Test
    void forwardsAuthenticatedRequestsToDownstreamService() throws Exception {
        backend.enqueue(new MockResponse().setResponseCode(200).setBody("{\"ok\":true}").addHeader("Content-Type", "application/json"));

        client.mutateWith(SecurityMockServerConfigurers.mockJwt()
                        .jwt(jwt -> jwt.subject("user-a"))
                        .authorities(new SimpleGrantedAuthority("SCOPE_users:read")))
                .get()
                .uri("/api/v1/users/profile")
                .exchange()
                .expectStatus().isOk()
                .expectHeader().exists("X-Correlation-Id")
                .expectHeader().exists("X-Trace-Id");

        var request = backend.takeRequest();
        assertThat(request.getPath()).isEqualTo("/profile");
    }

    @Test
    void rejectsRequestsWithoutAuthentication() {
        client.get()
                .uri("/api/v1/users/profile")
                .exchange()
                .expectStatus().isUnauthorized();
    }

    @Test
    void enforcesContentTypeValidation() {
        client.mutateWith(SecurityMockServerConfigurers.mockJwt()
                        .jwt(jwt -> jwt.subject("user-b"))
                        .authorities(new SimpleGrantedAuthority("SCOPE_users:read")))
                .post()
                .uri("/api/v1/users/profile")
                .contentType(MediaType.TEXT_PLAIN)
                .bodyValue("plain text")
                .exchange()
                .expectStatus().isBadRequest();
    }

    @Test
    void enforcesRateLimits() {
        backend.enqueue(new MockResponse().setResponseCode(200).setBody("{\"ok\":true}").addHeader("Content-Type", "application/json"));
        backend.enqueue(new MockResponse().setResponseCode(200).setBody("{\"ok\":true}").addHeader("Content-Type", "application/json"));

        client.mutateWith(SecurityMockServerConfigurers.mockJwt()
                        .jwt(jwt -> jwt.subject("user-c"))
                        .authorities(new SimpleGrantedAuthority("SCOPE_search:read")))
                .get()
                .uri("/api/v1/search/query")
                .exchange()
                .expectStatus().isOk();

        client.mutateWith(SecurityMockServerConfigurers.mockJwt()
                        .jwt(jwt -> jwt.subject("user-c"))
                        .authorities(new SimpleGrantedAuthority("SCOPE_search:read")))
                .get()
                .uri("/api/v1/search/query")
                .exchange()
                .expectStatus().isEqualTo(429);
    }
}
