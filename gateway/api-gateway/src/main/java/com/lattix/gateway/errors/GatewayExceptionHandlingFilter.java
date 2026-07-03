package com.lattix.gateway.errors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import reactor.core.publisher.Mono;

public class GatewayExceptionHandlingFilter implements GlobalFilter, Ordered {
    private static final Logger log = LoggerFactory.getLogger(GatewayExceptionHandlingFilter.class);
    private final GatewayErrorWriter errorWriter;

    public GatewayExceptionHandlingFilter(GatewayErrorWriter errorWriter) {
        this.errorWriter = errorWriter;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return chain.filter(exchange).onErrorResume(error -> {
            log.error("Gateway request failed", error);
            return errorWriter.write(exchange, GatewayFailureMapper.mapGatewayFailure(error));
        });
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
