package com.lattix.gateway.errors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lattix.shared.backend.web.ErrorResponse;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.security.web.server.authorization.ServerAccessDeniedHandler;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;

public class GatewayErrorWriter {
    private final ObjectMapper objectMapper;

    public GatewayErrorWriter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public Mono<Void> write(ServerWebExchange exchange, GatewayFailure failure) {
        ErrorResponse response = new ErrorResponse(
                Optional.ofNullable(exchange.getRequest().getId()).orElse("unknown"),
                failure.code(),
                failure.message(),
                failure.details(),
                failure.retryable());
        HttpStatus status = failure.status();
        exchange.getResponse().setStatusCode(status);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
        exchange.getResponse().getHeaders().set(HttpHeaders.CACHE_CONTROL, "no-store");
        try {
            byte[] bytes = objectMapper.writeValueAsBytes(response);
            DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(bytes);
            return exchange.getResponse().writeWith(Mono.just(buffer));
        } catch (Exception ex) {
            byte[] bytes = ("{\"code\":\"GATEWAY_ERROR\",\"message\":\"" + ex.getMessage() + "\"}")
                    .getBytes(StandardCharsets.UTF_8);
            return exchange.getResponse().writeWith(Mono.just(exchange.getResponse().bufferFactory().wrap(bytes)));
        }
    }

    public ServerAuthenticationEntryPoint authenticationEntryPoint() {
        return (exchange, exception) -> write(exchange, GatewayFailure.unauthorized("AUTHENTICATION_REQUIRED", "Authentication is required"));
    }

    public ServerAccessDeniedHandler accessDeniedHandler() {
        return (exchange, denied) -> write(exchange, GatewayFailure.forbidden("ACCESS_DENIED", "Access is denied"));
    }
}
