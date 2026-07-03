package com.lattix.auth.domain;

import jakarta.validation.constraints.NotBlank;

public record OAuthCallbackRequest(
        @NotBlank String provider,
        @NotBlank String code,
        String redirectUri,
        String ip,
        String userAgent,
        String workspaceId) {
}
