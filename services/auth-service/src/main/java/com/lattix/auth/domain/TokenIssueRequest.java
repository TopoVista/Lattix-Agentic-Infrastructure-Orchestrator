package com.lattix.auth.domain;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public record TokenIssueRequest(
        UUID userId,
        UUID sessionId,
        String email,
        String displayName,
        String workspaceId,
        List<Role> roles,
        Map<String, String> attributes,
        boolean mfaSatisfied) {
}
