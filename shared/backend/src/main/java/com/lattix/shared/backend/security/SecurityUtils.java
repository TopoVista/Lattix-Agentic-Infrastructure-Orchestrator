package com.lattix.shared.backend.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Map;

public final class SecurityUtils {
    private SecurityUtils() {
    }

    public static CurrentPrincipal requirePrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated principal present");
        }
        return new CurrentPrincipal(authentication.getName(), List.of("USER"), Map.of());
    }
}
