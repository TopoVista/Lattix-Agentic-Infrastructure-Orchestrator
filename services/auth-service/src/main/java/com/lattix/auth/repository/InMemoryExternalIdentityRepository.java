package com.lattix.auth.repository;

import com.lattix.auth.domain.ExternalIdentity;
import com.lattix.auth.domain.OAuthProvider;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class InMemoryExternalIdentityRepository implements ExternalIdentityRepository {
    private final Map<String, ExternalIdentity> byProviderAndId = new ConcurrentHashMap<>();
    private final Map<String, ExternalIdentity> byUserAndProvider = new ConcurrentHashMap<>();

    @Override
    public Optional<ExternalIdentity> findByProviderAndProviderUserId(OAuthProvider provider, String providerUserId) {
        return Optional.ofNullable(byProviderAndId.get(key(provider, providerUserId)));
    }

    @Override
    public Optional<ExternalIdentity> findByUserIdAndProvider(UUID userId, OAuthProvider provider) {
        return Optional.ofNullable(byUserAndProvider.get(key(userId, provider)));
    }

    @Override
    public ExternalIdentity save(ExternalIdentity identity) {
        byProviderAndId.put(key(identity.provider(), identity.providerUserId()), identity);
        byUserAndProvider.put(key(identity.userId(), identity.provider()), identity);
        return identity;
    }

    private String key(OAuthProvider provider, String providerUserId) {
        return provider.name() + ":" + providerUserId;
    }

    private String key(UUID userId, OAuthProvider provider) {
        return userId + ":" + provider.name();
    }
}
