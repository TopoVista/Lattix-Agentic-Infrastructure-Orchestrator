package com.lattix.auth.domain;

import java.time.Instant;
import java.util.UUID;

public record ExternalIdentity(
        UUID userId,
        OAuthProvider provider,
        String providerUserId,
        String email,
        Instant linkedAt) {
}
