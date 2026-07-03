package com.lattix.gateway.tracing;

import com.lattix.gateway.audit.AccessDecision;
import com.lattix.gateway.audit.GatewayAuditEvent;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.UUID;

public class GatewayTracingGlobalFilter implements GlobalFilter, Ordered {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String correlationId = header(exchange, "X-Correlation-Id");
        String traceId = header(exchange, "X-Trace-Id");
        String requestId = correlationId == null ? UUID.randomUUID().toString() : correlationId;
        String computedTraceId = traceId == null ? UUID.randomUUID().toString() : traceId;
        exchange.getAttributes().put("lattix.correlationId", requestId);
        exchange.getAttributes().put("lattix.traceId", computedTraceId);
        exchange.getResponse().getHeaders().set("X-Correlation-Id", requestId);
        exchange.getResponse().getHeaders().set("X-Trace-Id", computedTraceId);
        return chain.filter(exchange);
    }

    private String header(ServerWebExchange exchange, String name) {
        return exchange.getRequest().getHeaders().getFirst(name);
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 10;
    }
}
