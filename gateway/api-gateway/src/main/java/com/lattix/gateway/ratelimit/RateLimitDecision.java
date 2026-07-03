package com.lattix.gateway.ratelimit;

import java.time.Instant;

public record RateLimitDecision(
        boolean allowed,
        long remaining,
        Instant resetAt,
        String reason) {
}
