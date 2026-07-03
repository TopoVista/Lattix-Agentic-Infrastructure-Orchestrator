package com.lattix.auth.domain;

import java.util.Map;
import java.util.UUID;

public record AuthorizationRequest(
        UUID userId,
        UUID workspaceId,
        String resourceType,
        String action,
        ActionSensitivity sensitivity,
        Map<String, String> attributes,
        boolean mfaSatisfied) {
}
