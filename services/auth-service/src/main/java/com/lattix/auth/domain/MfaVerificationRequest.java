package com.lattix.auth.domain;

import java.util.UUID;

public record MfaVerificationRequest(
        UUID challengeId,
        String code,
        String recoveryCode) {
}
