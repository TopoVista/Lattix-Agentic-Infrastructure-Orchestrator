package com.lattix.auth.repository;

import com.lattix.auth.domain.ExternalIdentity;
import com.lattix.auth.domain.OAuthProvider;

import java.util.Optional;
import java.util.UUID;

public interface ExternalIdentityRepository {
    Optional<ExternalIdentity> findByProviderAndProviderUserId(OAuthProvider provider, String providerUserId);

    Optional<ExternalIdentity> findByUserIdAndProvider(UUID userId, OAuthProvider provider);

    ExternalIdentity save(ExternalIdentity identity);
}
