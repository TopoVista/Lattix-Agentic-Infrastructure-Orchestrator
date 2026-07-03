package com.lattix.auth.domain;

import java.util.List;

public record PolicyDecision(
        boolean allowed,
        String reason,
        boolean requiredMfa,
        List<String> matchedRules) {
}
