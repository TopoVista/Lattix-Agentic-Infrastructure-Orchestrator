package com.lattix.gateway.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lattix.gateway.audit.GatewayAuditPublisher;
import com.lattix.gateway.audit.LoggingGatewayAuditPublisher;
import com.lattix.gateway.errors.GatewayErrorWriter;
import com.lattix.gateway.errors.GatewayExceptionHandlingFilter;
import com.lattix.gateway.ratelimit.GatewayRateLimitGlobalFilter;
import com.lattix.gateway.ratelimit.GatewayRateLimitService;
import com.lattix.gateway.ratelimit.GatewayRateLimitStore;
import com.lattix.gateway.ratelimit.InMemoryGatewayRateLimitStore;
import com.lattix.gateway.ratelimit.RedisGatewayRateLimitStore;
import com.lattix.gateway.tracing.GatewayTracingGlobalFilter;
import com.lattix.gateway.validation.GatewayRequestValidationGlobalFilter;
import com.lattix.gateway.validation.GatewayRequestValidator;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;

@Configuration
public class GatewayRuntimeConfiguration {

    @Bean
    public GatewayAuditPublisher gatewayAuditPublisher() {
        return new LoggingGatewayAuditPublisher();
    }

    @Bean
    public GatewayErrorWriter gatewayErrorWriter(ObjectMapper objectMapper) {
        return new GatewayErrorWriter(objectMapper);
    }

    @Bean
    public GatewayRateLimitService gatewayRateLimitService(GatewayProperties properties, GatewayRateLimitStore store) {
        return new GatewayRateLimitService(properties, store);
    }

    @Bean
    public GatewayRequestValidator gatewayRequestValidator(GatewayProperties properties) {
        return new GatewayRequestValidator(properties.validation());
    }

    @Bean
    public GatewayExceptionHandlingFilter gatewayExceptionHandlingFilter(GatewayErrorWriter errorWriter) {
        return new GatewayExceptionHandlingFilter(errorWriter);
    }

    @Bean
    public GatewayTracingGlobalFilter gatewayTracingGlobalFilter() {
        return new GatewayTracingGlobalFilter();
    }

    @Bean
    public GatewayRateLimitGlobalFilter gatewayRateLimitGlobalFilter(GatewayRateLimitService rateLimitService,
                                                                     GatewayErrorWriter errorWriter,
                                                                     GatewayAuditPublisher auditPublisher) {
        return new GatewayRateLimitGlobalFilter(rateLimitService, errorWriter, auditPublisher);
    }

    @Bean
    public GatewayRequestValidationGlobalFilter gatewayRequestValidationGlobalFilter(GatewayRequestValidator validator,
                                                                                     GatewayErrorWriter errorWriter) {
        return new GatewayRequestValidationGlobalFilter(validator, errorWriter);
    }

    @Bean
    @ConditionalOnProperty(name = "lattix.gateway.rate-limit.backend", havingValue = "redis")
    public GatewayRateLimitStore redisGatewayRateLimitStore(ReactiveStringRedisTemplate redisTemplate) {
        return new RedisGatewayRateLimitStore(redisTemplate);
    }

    @Bean
    @ConditionalOnProperty(name = "lattix.gateway.rate-limit.backend", havingValue = "memory", matchIfMissing = true)
    public GatewayRateLimitStore inMemoryGatewayRateLimitStore() {
        return new InMemoryGatewayRateLimitStore();
    }
}
