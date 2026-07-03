package com.lattix.auth.domain;

public enum SessionStatus {
    ACTIVE,
    REVOKED,
    EXPIRED,
    MFA_REQUIRED
}
