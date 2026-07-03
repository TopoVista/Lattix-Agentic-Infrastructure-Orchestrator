package com.lattix.gateway.audit;

public record AccessDecision(
        boolean allowed,
        String reason) {

    public static AccessDecision granted() {
        return new AccessDecision(true, "allowed");
    }

    public static AccessDecision denied(String reason) {
        return new AccessDecision(false, reason);
    }
}
