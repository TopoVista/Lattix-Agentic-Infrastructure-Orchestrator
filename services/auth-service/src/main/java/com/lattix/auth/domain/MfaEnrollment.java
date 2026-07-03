package com.lattix.auth.domain;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record MfaEnrollment(
        UUID id,
        UUID userId,
        String secret,
        boolean enabled,
        List<String> recoveryCodes,
        Instant createdAt) {
}
