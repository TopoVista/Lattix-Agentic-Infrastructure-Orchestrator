package com.lattix.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "lattix.auth")
public record AuthServiceProperties(
        String issuer,
        long accessTokenTtlSeconds,
        long refreshTokenTtlSeconds,
        String mfaIssuerName,
        String privateKeyPem,
        String publicKeyPem,
        List<String> providers) {

    public AuthServiceProperties {
        issuer = issuer == null || issuer.isBlank() ? "lattix-auth" : issuer;
        accessTokenTtlSeconds = accessTokenTtlSeconds > 0 ? accessTokenTtlSeconds : 900;
        refreshTokenTtlSeconds = refreshTokenTtlSeconds > 0 ? refreshTokenTtlSeconds : 2_592_000;
        mfaIssuerName = mfaIssuerName == null || mfaIssuerName.isBlank() ? "Lattix" : mfaIssuerName;
        privateKeyPem = privateKeyPem == null ? "" : privateKeyPem;
        publicKeyPem = publicKeyPem == null ? "" : publicKeyPem;
        providers = providers == null || providers.isEmpty() ? List.of("google", "github", "microsoft") : List.copyOf(providers);
    }
}
