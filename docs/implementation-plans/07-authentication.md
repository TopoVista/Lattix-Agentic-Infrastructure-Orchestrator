# Phase 07 - Authentication

## Goal

Implement Lattix authentication, authorization, sessions, MFA, refresh tokens, and audit logging.

## Why This Phase Exists

Lattix will control repositories, infrastructure, deployments, secrets, cloud resources, and AI agents. Authentication and authorization must be built before broad platform capabilities so every future action can be tied to a user, workspace, policy, and audit record.

## Success Criteria

- Users can sign in with Google, GitHub, and Microsoft OAuth providers.
- JWT access tokens and refresh tokens are issued securely.
- RBAC and ABAC policy checks are available to backend services and agents.
- MFA is supported for sensitive operations.
- Sessions and audit logs are persisted.

## Deliverables

- `auth-service` implementation.
- OAuth provider configuration.
- User identity linking model.
- RBAC roles and ABAC attributes.
- Session and refresh token storage.
- MFA challenge flow.
- Audit log API and event emission.

## Folder Structure

```text
services/
  auth-service/
    src/main/java/com/lattix/auth/
      oauth/
      token/
      session/
      mfa/
      policy/
      audit/
      userlink/
shared/
  backend/security/
```

## Modules To Build

- OAuth module for provider login and account linking.
- Token module for JWT and refresh token lifecycle.
- Session module for active device and session tracking.
- Policy module for RBAC, ABAC, and permission decisions.
- MFA module for TOTP and recovery code support.
- Audit module for security events and access decisions.

## Functionality

- Sign in through Google, GitHub, and Microsoft.
- Link multiple provider identities to one Lattix user.
- Issue short-lived access tokens and rotating refresh tokens.
- Revoke sessions by user, device, workspace, or security event.
- Evaluate permissions for workspace actions, repository actions, cloud actions, and agent actions.
- Require MFA for destructive or privileged operations.

## Tech Stack

- Spring Boot.
- Spring Security OAuth Client and Resource Server.
- PostgreSQL for users, identities, sessions, roles, and audit logs.
- Redis for short-lived session and challenge state.
- JWT with asymmetric signing.
- TOTP for MFA.

## Implementation Plan

1. Define user, identity provider, session, role, permission, attribute, and audit schemas.
2. Implement OAuth callback flows for Google, GitHub, and Microsoft.
3. Implement user creation and provider identity linking.
4. Implement JWT issuance, refresh token rotation, revocation, and signing key rotation.
5. Implement RBAC roles: owner, admin, developer, viewer, auditor, service-account.
6. Implement ABAC attributes: workspace, project, environment, data class, action sensitivity.
7. Implement MFA enrollment, verification, recovery codes, and step-up authentication.
8. Emit audit events for login, logout, token refresh, permission denial, MFA, and admin actions.

## Functions / Classes / Interfaces To Implement

```java
OAuthLoginResult handleOAuthCallback(OAuthCallbackRequest request)
// Exchanges provider code, verifies identity, links user, creates session, and issues tokens.

TokenPair issueTokenPair(TokenIssueRequest request)
// Creates signed access token and rotating refresh token with workspace and role claims.

TokenPair rotateRefreshToken(String refreshToken)
// Validates current refresh token, revokes it, and issues a replacement pair.

PolicyDecision authorize(AuthorizationRequest request)
// Evaluates RBAC roles and ABAC attributes for a specific resource action.

MfaChallenge createMfaChallenge(MfaChallengeRequest request)
// Creates a step-up challenge for privileged or destructive operations.

AuditLog recordSecurityEvent(SecurityAuditInput input)
// Persists security event and emits an audit domain event.
```

## Configuration / Environment Variables

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `MICROSOFT_CLIENT_ID`
- `MICROSOFT_CLIENT_SECRET`
- `JWT_PRIVATE_KEY`
- `JWT_PUBLIC_KEY`
- `JWT_ISSUER`
- `ACCESS_TOKEN_TTL_SECONDS`
- `REFRESH_TOKEN_TTL_SECONDS`
- `MFA_ISSUER_NAME`

## Data Models / Schemas / Contracts

- `User`: id, email, displayName, status, createdAt, lastLoginAt.
- `ExternalIdentity`: userId, provider, providerUserId, email, linkedAt.
- `Session`: id, userId, device, ip, userAgent, status, createdAt, expiresAt.
- `RefreshToken`: id, sessionId, hash, status, rotatedFrom, expiresAt.
- `RoleAssignment`: userId, workspaceId, role, grantedBy, grantedAt.
- `PolicyDecision`: allowed, reason, requiredMfa, matchedRules.
- `AuditLog`: actor, action, resource, decision, ip, traceId, createdAt.

## Testing Plan

- Unit tests for token issuance, refresh rotation, and policy evaluation.
- OAuth callback tests with mocked providers.
- Integration tests with Postgres and Redis.
- Security tests for revoked tokens, expired tokens, invalid signatures, and replayed refresh tokens.
- MFA enrollment and challenge flow tests.

## Acceptance Criteria

- Users can authenticate through configured providers.
- Services can trust the gateway principal claims and call auth service for policy checks.
- Refresh tokens rotate and replay attempts are detected.
- Privileged actions can require MFA.
- Security events are audit logged.

## Risks And Mitigations

- Risk: OAuth provider behavior differs. Mitigation: isolate providers behind a common adapter.
- Risk: authorization becomes too coarse. Mitigation: combine RBAC defaults with ABAC checks.
- Risk: token theft. Mitigation: short access token TTL, refresh rotation, revocation, MFA, and audit alerts.

## Next Phase Handoff

Phase 8 should add durable data stores required by auth and the rest of the platform, using these identity and policy models as initial consumers.
