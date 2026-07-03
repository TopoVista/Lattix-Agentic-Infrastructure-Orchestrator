package com.lattix.auth.domain;

import java.util.UUID;

public record MfaChallengeRequest(
        UUID userId,
        String purpose,
        String device,
        String ip) {
}
