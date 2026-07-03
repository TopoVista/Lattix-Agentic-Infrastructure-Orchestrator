package com.lattix.gateway.ratelimit;

import reactor.core.publisher.Mono;

import java.time.Duration;

public interface GatewayRateLimitStore {
    Mono<Long> increment(String key, Duration ttl, long cost);
}
