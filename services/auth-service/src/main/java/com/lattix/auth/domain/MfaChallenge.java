package com.lattix.auth.domain;

import java.time.Instant;
import java.util.UUID;

public record MfaChallenge(
        UUID id,
        UUID userId,
        String purpose,
        String challengeCode,
        Instant expiresAt,
        boolean verified) {
}
