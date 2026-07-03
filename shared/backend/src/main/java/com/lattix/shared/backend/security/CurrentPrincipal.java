package com.lattix.shared.backend.security;

import java.util.List;
import java.util.Map;

public class CurrentPrincipal {
    private String userId;
    private List<String> roles;
    private Map<String, Object> attributes;

    public CurrentPrincipal(String userId, List<String> roles, Map<String, Object> attributes) {
        this.userId = userId;
        this.roles = roles;
        this.attributes = attributes;
    }

    public String getUserId() {
        return userId;
    }

    public List<String> getRoles() {
        return roles;
    }

    public Map<String, Object> getAttributes() {
        return attributes;
    }
}
