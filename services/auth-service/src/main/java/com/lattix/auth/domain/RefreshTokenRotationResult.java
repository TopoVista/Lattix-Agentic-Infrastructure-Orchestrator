package com.lattix.auth.domain;

public record RefreshTokenRotationResult(
        TokenPair tokenPair,
        boolean replayDetected) {
}
