package com.lattix.gateway.audit;

import org.springframework.web.server.ServerWebExchange;
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils;
import org.springframework.cloud.gateway.route.Route;

import java.time.Instant;
import java.util.Optional;

public record GatewayAuditEvent(
        String actor,
        String workspace,
        String route,
        String method,
        AccessDecision decision,
        int status,
        long latencyMs,
        String traceId,
        Instant timestamp) {

    public static GatewayAuditEvent from(ServerWebExchange exchange, AccessDecision decision, String correlationId, String traceId, Instant timestamp) {
        String route = Optional.ofNullable(exchange.getAttribute(ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR))
                .map(Route.class::cast)
                .map(Route::getId)
                .orElseGet(() -> Optional.ofNullable(exchange.getRequest().getPath().value()).orElse("unknown"));
        return new GatewayAuditEvent(
                Optional.ofNullable(correlationId).filter(value -> !value.isBlank()).orElse("anonymous"),
                exchange.getRequest().getHeaders().getFirst("X-Workspace-Id"),
                route,
                Optional.ofNullable(exchange.getRequest().getMethod()).map(method -> method.name()).orElse("UNKNOWN"),
                decision,
                Optional.ofNullable(exchange.getResponse().getStatusCode()).map(status -> status.value()).orElse(200),
                0L,
                traceId,
                timestamp);
    }
}
