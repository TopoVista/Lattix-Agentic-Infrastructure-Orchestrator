package com.lattix.gateway.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;

import java.util.Objects;

public class GatewayTokenService {
    private final ReactiveJwtDecoder jwtDecoder;
    private final GatewayJwtAuthenticationConverter converter;

    public GatewayTokenService(ReactiveJwtDecoder jwtDecoder, GatewayJwtAuthenticationConverter converter) {
        this.jwtDecoder = jwtDecoder;
        this.converter = converter;
    }

    public AbstractAuthenticationToken validateJwt(String token) {
        Jwt jwt = Objects.requireNonNull(jwtDecoder.decode(token).block(), "Token could not be decoded");
        return converter.convert(jwt);
    }
}
