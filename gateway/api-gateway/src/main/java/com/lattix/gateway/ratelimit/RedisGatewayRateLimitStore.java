package com.lattix.gateway.ratelimit;

import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import reactor.core.publisher.Mono;

import java.time.Duration;

public class RedisGatewayRateLimitStore implements GatewayRateLimitStore {
    private final ReactiveStringRedisTemplate redisTemplate;

    public RedisGatewayRateLimitStore(ReactiveStringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public Mono<Long> increment(String key, Duration ttl, long cost) {
        return redisTemplate.opsForValue()
                .increment(key, cost)
                .flatMap(value -> redisTemplate.expire(key, ttl).thenReturn(value));
    }
}
