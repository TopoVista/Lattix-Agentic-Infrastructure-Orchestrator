package com.lattix.auth.repository;

import com.lattix.auth.domain.RoleAssignment;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

public class InMemoryRoleAssignmentRepository implements RoleAssignmentRepository {
    private final CopyOnWriteArrayList<RoleAssignment> assignments = new CopyOnWriteArrayList<>();

    @Override
    public RoleAssignment save(RoleAssignment roleAssignment) {
        assignments.add(roleAssignment);
        return roleAssignment;
    }

    @Override
    public List<RoleAssignment> findByUserId(UUID userId) {
        return assignments.stream().filter(assignment -> assignment.userId().equals(userId)).collect(Collectors.toList());
    }

    @Override
    public List<RoleAssignment> findByUserIdAndWorkspaceId(UUID userId, UUID workspaceId) {
        return assignments.stream()
                .filter(assignment -> assignment.userId().equals(userId))
                .filter(assignment -> assignment.workspaceId().equals(workspaceId))
                .collect(Collectors.toList());
    }
}
