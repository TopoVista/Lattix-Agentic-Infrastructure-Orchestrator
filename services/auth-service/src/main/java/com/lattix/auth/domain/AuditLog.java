package com.lattix.auth.domain;

import java.time.Instant;
import java.util.UUID;

public record AuditLog(
        UUID id,
        String actor,
        String action,
        String resource,
        String decision,
        String ip,
        String traceId,
        Instant createdAt) {
}
