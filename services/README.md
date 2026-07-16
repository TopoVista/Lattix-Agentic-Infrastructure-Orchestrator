# Lattix Services — Developer Guide

> Spring Boot 3 / Java 21 microservices powering the Lattix backend.

## Service Inventory

| Service | Port | Phase | Description |
|---------|------|-------|-------------|
| `auth-service` | 8081 | 7 | OAuth, JWT, RBAC, ABAC, MFA, sessions |
| `workspace-service` | 8082 | 10 | Projects, repos, files, workspace state |
| `repository-service` | 8083 | 12 | Repository indexing and intelligence |
| `tool-service` | 8084 | 17 | MCP tool server |
| `knowledge-service` | 8085 | 14 | Knowledge graph REST/gRPC |
| `memory-service` | 8086 | 15 | Memory system REST API |
| `project-service` | 8087 | 10 | Project and task management |
| `notification-service` | 8088 | 10 | Notification delivery |
| `user-service` | 8089 | 7 | User profiles and preferences |
| `analytics-service` | 8090 | 20 | Usage analytics and reporting |
| `document-service` | 8091 | 39 | Documentation storage and search |
| `logging-service` | 8092 | 26 | Structured log aggregation |
| `monitoring-service` | 8093 | 26 | Health checks and SLO monitoring |
| `search-service` | 8094 | 8 | Full-text search (OpenSearch) |

## Building

```powershell
# Build all services
./gradlew build

# Build a specific service
./gradlew :services:auth-service:build

# Skip tests for faster build
./gradlew build -x test

# Run tests
./gradlew test
```

## Running a Service

```powershell
# Run auth-service locally
./gradlew :services:auth-service:bootRun

# With specific profile
./gradlew :services:auth-service:bootRun --args='--spring.profiles.active=local'
```

## Package Conventions

All services use:
- **Package root**: `com.lattix.<service-name>`
- **Port**: 808x (see table above)
- **Health**: `GET /actuator/health`
- **Metrics**: `GET /actuator/prometheus`
- **API docs**: `GET /swagger-ui.html`

## API Gateway (Phase 6)

All services are fronted by the API Gateway at port `8080`:

```
http://localhost:8080/api/auth/*          → auth-service
http://localhost:8080/api/workspaces/*    → workspace-service
http://localhost:8080/api/repos/*         → repository-service
http://localhost:8080/api/tools/*         → tool-service
http://localhost:8080/api/knowledge/*     → knowledge-service
```

### Gateway Features
- Rate limiting (100 req/min per user by default)
- JWT validation on every request
- CORS policy enforcement
- Request/response logging to Kafka
- Circuit breaker (Resilience4j)

## Authentication (Phase 7)

### JWT Flow
```
POST /api/auth/login
  Body: { email, password }
  Returns: { access_token, refresh_token, expires_in }

POST /api/auth/refresh
  Body: { refresh_token }
  Returns: { access_token }

POST /api/auth/logout
  Header: Authorization: Bearer <token>
```

### RBAC Roles
| Role | Code | Permissions |
|------|------|-------------|
| Owner | `ROLE_OWNER` | Full access |
| Admin | `ROLE_ADMIN` | Manage workspace/users/repos |
| Developer | `ROLE_DEVELOPER` | Code, tasks, terminal |
| Auditor | `ROLE_AUDITOR` | Read-only audit access |
| Viewer | `ROLE_VIEWER` | Dashboard read-only |

## Database Migrations (Phase 8)

```bash
# Migrations live in:
services/<service>/src/main/resources/db/migration/

# Run migrations manually (Flyway)
./gradlew :services:auth-service:flywayMigrate
```

## Shared Libraries

```
shared/
├── persistence/     JPA entities, repositories, base classes
├── messaging/       Kafka producers, consumers, event schemas
├── security/        JWT utils, RBAC annotations, audit
└── web/             Common DTOs, error handling, pagination
```

Usage in a service:
```kotlin
// build.gradle.kts
dependencies {
    implementation(project(":shared:persistence"))
    implementation(project(":shared:messaging"))
    implementation(project(":shared:security"))
}
```
