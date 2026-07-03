package com.lattix.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;

import java.time.Duration;

@Configuration
public class GatewayRouteConfiguration {

    @Bean
    public RouteLocator gatewayRouteLocator(RouteLocatorBuilder builder, GatewayProperties properties) {
        RouteLocatorBuilder.Builder routes = builder.routes();
        for (GatewayProperties.ServiceRoute route : properties.routes()) {
            routes.route(route.id(), predicate -> predicate
                    .path(route.path())
                    .filters(filter -> {
                        filter.stripPrefix(route.stripPrefix());
                        if (route.retries() > 0) {
                            filter.retry(retry -> {
                                retry.setRetries(route.retries());
                                retry.setMethods(HttpMethod.GET, HttpMethod.HEAD, HttpMethod.OPTIONS);
                                retry.setSeries(HttpStatus.Series.SERVER_ERROR);
                                retry.setBackoff(Duration.ofMillis(100), Duration.ofSeconds(1), 2, true);
                            });
                        }
                        filter.circuitBreaker(circuit -> {
                            circuit.setName(route.id());
                            circuit.setFallbackUri("forward:/internal/gateway/fallback/" + route.id());
                        });
                        return filter;
                    })
                    .uri(route.uri().toString()));
        }
        return routes.build();
    }
}
