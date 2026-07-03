package com.lattix.auth.repository;

import com.lattix.auth.domain.Role;
import com.lattix.auth.domain.RoleAssignment;

import java.util.List;
import java.util.UUID;

public interface RoleAssignmentRepository {
    RoleAssignment save(RoleAssignment roleAssignment);

    List<RoleAssignment> findByUserId(UUID userId);

    List<RoleAssignment> findByUserIdAndWorkspaceId(UUID userId, UUID workspaceId);

    default boolean hasRole(UUID userId, UUID workspaceId, Role role) {
        return findByUserIdAndWorkspaceId(userId, workspaceId).stream().anyMatch(assignment -> assignment.role() == role);
    }
}
