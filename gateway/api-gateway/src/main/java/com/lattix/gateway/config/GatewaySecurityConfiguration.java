package com.lattix.gateway.config;

import com.lattix.gateway.errors.GatewayErrorWriter;
import com.lattix.gateway.security.GatewayJwtAuthenticationConverter;
import com.lattix.gateway.security.GatewayTokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class GatewaySecurityConfiguration {

    @Bean
    public ReactiveJwtDecoder jwtDecoder(GatewayProperties properties) {
        SecretKey secretKey = new SecretKeySpec(properties.security().sharedSecret().getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        NimbusReactiveJwtDecoder decoder = NimbusReactiveJwtDecoder.withSecretKey(secretKey).build();
        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(properties.security().issuerUri());
        OAuth2TokenValidator<Jwt> withAudience = token -> token.getAudience().contains(properties.security().audience())
                ? OAuth2TokenValidatorResult.success()
                : OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "The required audience is missing", null));
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(withIssuer, withAudience));
        return decoder;
    }

    @Bean
    public Converter<Jwt, AbstractAuthenticationToken> gatewayJwtAuthenticationConverter() {
        return new GatewayJwtAuthenticationConverter();
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http,
                                                         GatewayProperties properties,
                                                         ReactiveJwtDecoder jwtDecoder,
                                                         Converter<Jwt, AbstractAuthenticationToken> jwtAuthenticationConverter,
                                                         GatewayErrorWriter errorWriter) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .authorizeExchange(exchanges -> {
                    for (String path : properties.security().publicPaths()) {
                        exchanges.pathMatchers(path).permitAll();
                    }
                    for (GatewayProperties.ServiceRoute route : properties.routes()) {
                        if (route.authRequired()) {
                            if (route.scopes().isEmpty()) {
                                exchanges.pathMatchers(route.path()).authenticated();
                            } else {
                                exchanges.pathMatchers(route.path()).hasAnyAuthority(route.scopes().stream().map(scope -> "SCOPE_" + scope).toArray(String[]::new));
                            }
                        } else {
                            exchanges.pathMatchers(route.path()).permitAll();
                        }
                    }
                    exchanges.anyExchange().authenticated();
                })
                .oauth2ResourceServer(resourceServer -> resourceServer
                        .jwt(jwt -> jwt.jwtDecoder(jwtDecoder)
                                .jwtAuthenticationConverter(new ReactiveJwtAuthenticationConverterAdapter((GatewayJwtAuthenticationConverter) jwtAuthenticationConverter))))
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(errorWriter.authenticationEntryPoint())
                        .accessDeniedHandler(errorWriter.accessDeniedHandler()))
                .build();
    }

    @Bean
    public GatewayTokenService gatewayTokenService(ReactiveJwtDecoder jwtDecoder,
                                                   GatewayJwtAuthenticationConverter converter) {
        return new GatewayTokenService(jwtDecoder, converter);
    }
}
