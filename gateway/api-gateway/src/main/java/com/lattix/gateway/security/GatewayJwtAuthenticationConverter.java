package com.lattix.gateway.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class GatewayJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        Collection<SimpleGrantedAuthority> authorities = authoritiesConverter.convert(jwt).stream()
                .map(authority -> new SimpleGrantedAuthority(authority.getAuthority()))
                .collect(Collectors.toSet());
        List<String> workspaceScopes = jwt.getClaimAsStringList("workspace_scopes");
        if (workspaceScopes != null) {
            authorities.addAll(workspaceScopes.stream()
                    .map(scope -> new SimpleGrantedAuthority("SCOPE_" + scope))
                    .toList());
        }
        return new JwtAuthenticationToken(jwt, authorities, jwt.getSubject());
    }
}
