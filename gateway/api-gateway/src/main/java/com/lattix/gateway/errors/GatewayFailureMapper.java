package com.lattix.gateway.errors;

import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebInputException;

import java.util.concurrent.TimeoutException;
import java.util.Map;

public final class GatewayFailureMapper {
    private GatewayFailureMapper() {
    }

    public static GatewayFailure mapGatewayFailure(Throwable error) {
        if (error instanceof AccessDeniedException) {
            return GatewayFailure.forbidden("ACCESS_DENIED", "Access is denied");
        }
        if (error instanceof JwtException || error instanceof SecurityException) {
            return GatewayFailure.unauthorized("INVALID_TOKEN", "The access token is invalid");
        }
        if (error instanceof ServerWebInputException) {
            return GatewayFailure.validation("INVALID_REQUEST", error.getMessage());
        }
        if (error instanceof IllegalArgumentException) {
            return GatewayFailure.validation("INVALID_ARGUMENT", error.getMessage());
        }
        if (error instanceof TimeoutException) {
            return new GatewayFailure(HttpStatus.GATEWAY_TIMEOUT, "UPSTREAM_TIMEOUT", "The upstream service timed out", true, Map.of());
        }
        if (error instanceof CallNotPermittedException) {
            return new GatewayFailure(HttpStatus.SERVICE_UNAVAILABLE, "CIRCUIT_OPEN", "The upstream circuit breaker is open", true, Map.of());
        }
        if (error instanceof ResponseStatusException statusException) {
            HttpStatus status = HttpStatus.valueOf(statusException.getStatusCode().value());
            return new GatewayFailure(status, "DOWNSTREAM_ERROR", statusException.getReason(), status.is5xxServerError(), Map.of());
        }
        return new GatewayFailure(HttpStatus.INTERNAL_SERVER_ERROR, "GATEWAY_ERROR", "An unexpected gateway failure occurred", true, Map.of());
    }
}
