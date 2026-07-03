package com.lattix.auth.config;

import com.lattix.auth.audit.AuditLogRepository;
import com.lattix.auth.audit.AuditService;
import com.lattix.auth.audit.InMemoryAuditLogRepository;
import com.lattix.auth.mfa.InMemoryMfaRepository;
import com.lattix.auth.mfa.MfaRepository;
import com.lattix.auth.mfa.MfaService;
import com.lattix.auth.oauth.GitHubOAuthProviderClient;
import com.lattix.auth.oauth.GoogleOAuthProviderClient;
import com.lattix.auth.oauth.MicrosoftOAuthProviderClient;
import com.lattix.auth.oauth.OAuthLoginService;
import com.lattix.auth.oauth.OAuthProviderClient;
import com.lattix.auth.policy.PolicyService;
import com.lattix.auth.repository.*;
import com.lattix.auth.session.InMemoryRefreshTokenRepository;
import com.lattix.auth.session.InMemorySessionRepository;
import com.lattix.auth.session.RefreshTokenRepository;
import com.lattix.auth.session.SessionRepository;
import com.lattix.auth.session.SessionService;
import com.lattix.auth.token.TokenService;
import com.lattix.auth.userlink.UserLinkService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;

import java.security.KeyPair;

@Configuration
public class AuthBeanConfiguration {

    @Bean
    public KeyPair authKeyPair(AuthServiceProperties properties) {
        return RsaKeySupport.loadOrGenerate(properties.privateKeyPem(), properties.publicKeyPem());
    }

    @Bean
    public JwtEncoder jwtEncoder(KeyPair keyPair) {
        return RsaKeySupport.jwtEncoder(keyPair);
    }

    @Bean
    public JwtDecoder jwtDecoder(KeyPair keyPair) {
        return RsaKeySupport.jwtDecoder(keyPair);
    }

    @Bean
    public UserRepository userRepository() {
        return new InMemoryUserRepository();
    }

    @Bean
    public ExternalIdentityRepository externalIdentityRepository() {
        return new InMemoryExternalIdentityRepository();
    }

    @Bean
    public SessionRepository sessionRepository() {
        return new InMemorySessionRepository();
    }

    @Bean
    public RefreshTokenRepository refreshTokenRepository() {
        return new InMemoryRefreshTokenRepository();
    }

    @Bean
    public RoleAssignmentRepository roleAssignmentRepository() {
        return new InMemoryRoleAssignmentRepository();
    }

    @Bean
    public MfaRepository mfaRepository() {
        return new InMemoryMfaRepository();
    }

    @Bean
    public AuditLogRepository auditLogRepository() {
        return new InMemoryAuditLogRepository();
    }

    @Bean
    public AuditService auditService(AuditLogRepository auditLogRepository) {
        return new AuditService(auditLogRepository);
    }

    @Bean
    public PolicyService policyService(RoleAssignmentRepository roleAssignmentRepository) {
        return new PolicyService(roleAssignmentRepository);
    }

    @Bean
    public MfaService mfaService(MfaRepository mfaRepository, AuditService auditService) {
        return new MfaService(mfaRepository, auditService);
    }

    @Bean
    public TokenService tokenService(AuthServiceProperties properties,
                                     JwtEncoder jwtEncoder,
                                     JwtDecoder jwtDecoder,
                                     RefreshTokenRepository refreshTokenRepository,
                                     SessionRepository sessionRepository,
                                     AuditService auditService,
                                     PolicyService policyService) {
        return new TokenService(properties, jwtEncoder, jwtDecoder, refreshTokenRepository, sessionRepository, auditService, policyService);
    }

    @Bean
    public SessionService sessionService(SessionRepository sessionRepository,
                                         RefreshTokenRepository refreshTokenRepository,
                                         AuditService auditService) {
        return new SessionService(sessionRepository, refreshTokenRepository, auditService);
    }

    @Bean
    public UserLinkService userLinkService(UserRepository userRepository,
                                           ExternalIdentityRepository externalIdentityRepository,
                                           RoleAssignmentRepository roleAssignmentRepository) {
        return new UserLinkService(userRepository, externalIdentityRepository, roleAssignmentRepository);
    }

    @Bean
    public OAuthProviderClient googleOAuthProviderClient() {
        return new GoogleOAuthProviderClient();
    }

    @Bean
    public OAuthProviderClient gitHubOAuthProviderClient() {
        return new GitHubOAuthProviderClient();
    }

    @Bean
    public OAuthProviderClient microsoftOAuthProviderClient() {
        return new MicrosoftOAuthProviderClient();
    }

    @Bean
    public OAuthLoginService oAuthLoginService(AuthServiceProperties properties,
                                               java.util.List<OAuthProviderClient> clients,
                                               UserLinkService userLinkService,
                                               SessionService sessionService,
                                               TokenService tokenService,
                                               AuditService auditService,
                                               MfaService mfaService) {
        return new OAuthLoginService(properties, clients, userLinkService, sessionService, tokenService, auditService, mfaService);
    }
}
