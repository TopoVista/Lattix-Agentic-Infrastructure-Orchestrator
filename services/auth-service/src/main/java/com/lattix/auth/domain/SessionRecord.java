package com.lattix.auth.domain;

import java.time.Instant;
import java.util.UUID;

public record SessionRecord(
        UUID id,
        UUID userId,
        String device,
        String ip,
        String userAgent,
        SessionStatus status,
        Instant createdAt,
        Instant expiresAt,
        boolean mfaSatisfied) {
}
