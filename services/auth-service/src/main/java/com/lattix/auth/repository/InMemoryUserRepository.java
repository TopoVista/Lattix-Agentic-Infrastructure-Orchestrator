package com.lattix.auth.repository;

import com.lattix.auth.domain.User;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class InMemoryUserRepository implements UserRepository {
    private final Map<UUID, User> users = new ConcurrentHashMap<>();
    private final Map<String, UUID> emails = new ConcurrentHashMap<>();

    @Override
    public Optional<User> findById(UUID id) {
        return Optional.ofNullable(users.get(id));
    }

    @Override
    public Optional<User> findByEmail(String email) {
        UUID id = emails.get(normalize(email));
        return id == null ? Optional.empty() : findById(id);
    }

    @Override
    public User save(User user) {
        users.put(user.id(), user);
        emails.put(normalize(user.email()), user.id());
        return user;
    }

    private String normalize(String email) {
        return email == null ? "" : email.toLowerCase();
    }
}
