package com.lattix.gateway.security;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class GatewayTokenServiceTest {

    @Test
    void validateJwtParsesSubjectAndScopes() throws Exception {
        SecretKey key = new SecretKeySpec("01234567890123456789012345678901".getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        ReactiveJwtDecoder decoder = NimbusReactiveJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();
        GatewayTokenService service = new GatewayTokenService(decoder, new GatewayJwtAuthenticationConverter());

        String token = signedToken(key, "user-1", List.of("users:read"), "workspace-1");

        assertThat(service.validateJwt(token).getName()).isEqualTo("user-1");
    }

    private String signedToken(SecretKey key, String subject, List<String> scopes, String workspaceId) throws JOSEException {
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(subject)
                .issuer("https://auth.lattix.local")
                .audience("lattix-api")
                .issueTime(java.util.Date.from(Instant.now()))
                .expirationTime(java.util.Date.from(Instant.now().plusSeconds(600)))
                .claim("scope", String.join(" ", scopes))
                .claim("workspace_id", workspaceId)
                .build();
        SignedJWT jwt = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claims);
        jwt.sign(new MACSigner(key.getEncoded()));
        return jwt.serialize();
    }
}
