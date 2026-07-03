package com.lattix.gateway.ratelimit;

public record RateLimitRequest(
        String actorId,
        String workspaceId,
        String tokenId,
        String ip,
        String route,
        int cost) {
}
