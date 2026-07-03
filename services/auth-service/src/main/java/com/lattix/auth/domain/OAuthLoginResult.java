package com.lattix.auth.domain;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record OAuthLoginResult(
        UUID userId,
        String email,
        String displayName,
        OAuthProvider provider,
        UUID sessionId,
        String accessToken,
        String refreshToken,
        Instant accessTokenExpiresAt,
        Instant refreshTokenExpiresAt,
        List<String> roles,
        boolean mfaRequired) {
}
