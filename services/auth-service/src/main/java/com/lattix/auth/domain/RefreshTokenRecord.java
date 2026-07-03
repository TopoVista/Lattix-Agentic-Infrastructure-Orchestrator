package com.lattix.auth.domain;

import java.time.Instant;
import java.util.UUID;

public record RefreshTokenRecord(
        UUID id,
        UUID sessionId,
        String hash,
        RefreshTokenStatus status,
        String rotatedFrom,
        Instant createdAt,
        Instant expiresAt) {
}
