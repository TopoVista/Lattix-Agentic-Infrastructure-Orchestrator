package com.lattix.gateway.errors;

import org.springframework.http.HttpStatus;

import java.util.Map;

public record GatewayFailure(
        HttpStatus status,
        String code,
        String message,
        boolean retryable,
        Map<String, Object> details) {

    public static GatewayFailure unauthorized(String code, String message) {
        return new GatewayFailure(HttpStatus.UNAUTHORIZED, code, message, false, Map.of());
    }

    public static GatewayFailure forbidden(String code, String message) {
        return new GatewayFailure(HttpStatus.FORBIDDEN, code, message, false, Map.of());
    }

    public static GatewayFailure tooManyRequests(String code, String message, Map<String, Object> details) {
        return new GatewayFailure(HttpStatus.TOO_MANY_REQUESTS, code, message, true, details);
    }

    public static GatewayFailure validation(String code, String message) {
        return new GatewayFailure(HttpStatus.BAD_REQUEST, code, message, false, Map.of());
    }

    public static GatewayFailure downstream(String code, String message) {
        return new GatewayFailure(HttpStatus.BAD_GATEWAY, code, message, true, Map.of());
    }
}
