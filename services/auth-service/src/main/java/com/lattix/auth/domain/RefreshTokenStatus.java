package com.lattix.auth.domain;

public enum RefreshTokenStatus {
    ACTIVE,
    ROTATED,
    REVOKED,
    REPLAYED
}
