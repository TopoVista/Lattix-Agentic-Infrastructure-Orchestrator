package com.lattix.gateway.ratelimit;

import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

public class InMemoryGatewayRateLimitStore implements GatewayRateLimitStore {
    private final Map<String, Counter> counters = new ConcurrentHashMap<>();

    @Override
    public Mono<Long> increment(String key, Duration ttl, long cost) {
        Counter counter = counters.compute(key, (ignored, existing) -> {
            if (existing == null || existing.isExpired()) {
                return new Counter(ttl);
            }
            return existing;
        });
        return Mono.fromSupplier(() -> counter.increment(cost));
    }

    private static final class Counter {
        private final long expiresAtMillis;
        private final AtomicLong count = new AtomicLong();

        private Counter(Duration ttl) {
            this.expiresAtMillis = System.currentTimeMillis() + ttl.toMillis();
        }

        private long increment(long cost) {
            return count.addAndGet(cost);
        }

        private boolean isExpired() {
            return System.currentTimeMillis() > expiresAtMillis;
        }
    }
}
