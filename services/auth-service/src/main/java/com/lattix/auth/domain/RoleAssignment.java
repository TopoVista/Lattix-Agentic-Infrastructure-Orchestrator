package com.lattix.auth.domain;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record RoleAssignment(
        UUID userId,
        UUID workspaceId,
        Role role,
        UUID grantedBy,
        Instant grantedAt,
        Map<String, String> attributes) {
}
