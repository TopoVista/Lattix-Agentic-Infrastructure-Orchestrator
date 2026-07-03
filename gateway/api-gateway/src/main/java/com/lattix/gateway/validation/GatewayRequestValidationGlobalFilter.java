package com.lattix.gateway.validation;

import com.lattix.gateway.errors.GatewayErrorWriter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

public class GatewayRequestValidationGlobalFilter implements GlobalFilter, Ordered {
    private final GatewayRequestValidator validator;
    private final GatewayErrorWriter errorWriter;

    public GatewayRequestValidationGlobalFilter(GatewayRequestValidator validator, GatewayErrorWriter errorWriter) {
        this.validator = validator;
        this.errorWriter = errorWriter;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        if (exchange.getRequest().getPath().value().startsWith("/internal/gateway/")) {
            return chain.filter(exchange);
        }
        return validator.validate(exchange)
                .map(failure -> errorWriter.write(exchange, failure))
                .orElseGet(() -> chain.filter(exchange));
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 15;
    }
}
