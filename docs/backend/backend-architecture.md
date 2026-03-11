# Backend Architecture

## Purpose
This document defines the NestJS application structure, module map, API conventions, request context handling, and async execution boundaries.

## Monorepo Service Layout
Recommended monorepo structure:

```text
apps/
  api/
services/
  analytics/
  ai-orchestrator/
packages/
  shared-types/
  api-contracts/
  config/
  eslint-config/
  tsconfig/
prisma/
  schema/
  migrations/
infra/
  docker/
  compose/
docs/
```

`apps/api` owns domain APIs and orchestration. `services/analytics` and `services/ai-orchestrator` are runtime boundaries for specialized execution.

## ORM and Data Access Standard
Use Prisma as the backend ORM for the NestJS API.

Recommended approach:
- maintain the canonical Prisma schema in the top-level `prisma/` directory
- generate the Prisma client from that shared schema location for the API application
- keep domain repositories as thin wrappers around Prisma queries and transactions
- use Prisma migrations for application-managed schema changes

Why Prisma:
- strong TypeScript ergonomics for a NestJS codebase
- good fit for a greenfield modular monolith
- clean generated types for DTO mapping and service orchestration
- practical support for PostgreSQL and migration-driven delivery

Constraint:
- Prisma is the ORM and migration layer, but domain services must still hide raw Prisma access behind repository boundaries

## NestJS Module Map
Recommended modules:
- `auth`
- `identity`
- `tenants`
- `memberships`
- `projects`
- `studies`
- `forms`
- `variables`
- `ingestion`
- `cohorts`
- `datasets`
- `analyses`
- `manuscripts`
- `ai-orchestration`
- `approvals`
- `audit`
- `storage`
- `jobs`
- `notifications`
- `platform-admin`
- `shared`

## Shared Boundaries
Shared support modules:
- `db`
- `request-context`
- `access-control`
- `guards`
- `decorators`
- `interceptors`
- `events`
- `config`
- `observability`
- `errors`

Rules:
- domain modules may depend on shared infrastructure
- domain modules should not reach into each other’s repositories directly
- integration between domains should happen through services, explicit interfaces, or internal domain events

The `db` shared module should provide:
- `PrismaService`
- transaction helpers
- tenant-aware query helpers
- database session variable helpers for RLS-sensitive flows

## Suggested Source Layout
```text
apps/api/src/
  main.ts
  app.module.ts
  modules/
    auth/
    identity/
    tenants/
    memberships/
    projects/
    studies/
    forms/
    variables/
    ingestion/
    cohorts/
    datasets/
    analyses/
    manuscripts/
    ai-orchestration/
    approvals/
    audit/
    storage/
    jobs/
    notifications/
    platform-admin/
  shared/
    db/
      prisma/
      prisma.service.ts
      prisma.module.ts
      transaction-manager.ts
      rls-context.ts
    request-context/
    access-control/
    guards/
    decorators/
    interceptors/
    events/
    config/
    observability/
    errors/
```

## Request Context and Tenant Resolution
Every request should resolve:
- `userId`
- `sessionId`
- `tenantId`
- `projectId` when route-scoped
- effective roles
- `requestId`

Recommended flow:
1. auth guard validates session/JWT
2. tenant guard confirms route tenant matches active membership
3. project guard confirms project belongs to tenant and actor has access
4. request context service stores resolved values
5. database connection sets RLS session variables

## Controller / Service / Repository Pattern
Recommended pattern:
- controller: HTTP translation only
- service: business rules and policy orchestration
- repository: persistence only

Avoid:
- business rules in controllers
- raw Prisma models leaking to clients
- cross-module repository access

Suggested internal structure per module:

```text
modules/projects/
  controllers/
  services/
  repositories/
  dto/
  policies/
  models/
  mappers/
  events/
```

Repository guidance with Prisma:
- repositories may use Prisma client directly
- repositories should return domain-shaped models or persistence DTOs, not unfiltered Prisma payloads
- complex multi-write flows should use Prisma transactions coordinated by the service layer or a transaction helper
- shared query fragments for tenant scoping should live in repository or db helpers, not controllers

## DTO Conventions
DTO guidance:
- separate request DTOs from response DTOs
- do not return Prisma models directly
- include explicit validation decorators
- prefer clear naming:
  - `CreateProjectRequestDto`
  - `UpdateProjectRequestDto`
  - `ProjectSummaryResponseDto`
  - `ProjectDetailResponseDto`

Use command/query distinction in service methods:
- `createProject`
- `updateProject`
- `listProjects`
- `getProjectDetail`

## Entity Naming Conventions
- use singular nouns for entities: `Project`, `DatasetVersion`, `AnalysisRun`
- use `Version` suffix for immutable revisions
- use `Snapshot` suffix for deterministic captured states
- use `Approval` suffix for review gates
- use `Event` suffix for audit and domain events

## API Versioning and Routes
Recommended API base:
- `/api/v1`

Tenant-aware route pattern:
- `/api/v1/tenants/:tenantId/projects`
- `/api/v1/tenants/:tenantId/projects/:projectId/datasets`

Guidelines:
- route tenant explicitly
- use UUIDs for identifiers
- keep nested resources shallow but meaningful
- use POST for queued operations that create jobs

## Async Job Model
BullMQ should power:
- file parse jobs
- profiling jobs
- dataset materialization
- analysis execution
- AI drafting
- export generation
- notification delivery

Job payload minimum fields:
- `tenantId`
- `projectId`
- `actorUserId`
- resource id
- request or correlation id

Workers should re-load authoritative resource state before execution.

## Synchronous vs Queued Operations
Synchronous:
- auth/session operations
- tenant/project retrieval
- collaborator listing
- lightweight metadata updates
- review decisions

Queued:
- upload parsing
- dataset builds
- heavy cohort evaluation if large
- all analysis runs
- AI drafting
- manuscript export packaging

## Error Model
Use a consistent envelope:
- machine-readable error code
- human-readable message
- request id
- field validation details when applicable

Categories:
- auth errors
- permission errors
- validation errors
- conflict errors
- resource state errors
- processing errors

Important domain-specific examples:
- dataset not approved
- project tenant mismatch
- evidence bundle incomplete
- analysis spec unsupported

## Event Emission Expectations
Emit internal events for:
- project created
- collaborator invited
- import completed
- cohort snapshotted
- dataset version approved
- analysis run completed
- AI draft validated
- manuscript export approved

Eventing guidance:
- use events for side effects, not core write consistency
- audit emission may be synchronous for high-sensitivity actions

## Backend-Visible Policies
Critical policies should exist as explicit services:
- tenant membership policy
- project access policy
- dataset approval policy
- analysis execution policy
- AI evidence policy
- manuscript export policy

Avoid scattering policy logic in controllers or repositories.

## Service Integration with Analytics
`analyses` module responsibilities:
- validate analysis request
- create `AnalysisJob`
- enqueue execution
- receive results or poll worker status
- register outputs
- expose results to UI and AI workflows

The core API should not run statistical methods directly.

## Service Integration with AI
`ai-orchestration` module responsibilities:
- verify approved inputs
- construct evidence bundle
- call orchestration service
- store validation reports and drafts
- expose review actions

## Database Implications
- all repositories must be tenant-aware
- request-scoped or transaction-aware helpers should set database session variables for RLS
- versioned aggregates should prefer append-only write paths
- audit writes should happen in the same transaction for critical actions when possible

Prisma-specific implications:
- some RLS-sensitive queries may require explicit transaction wrappers that set PostgreSQL session variables before reads and writes
- raw SQL should be limited to cases Prisma cannot express cleanly, such as selected policy/session setup or advanced PostgreSQL features
- Prisma schema naming should align with domain vocabulary: `Project`, `DatasetVersion`, `AnalysisRun`, `EvidenceBundle`, `ManuscriptVersion`

## Assumptions
- NestJS remains the main backend framework for v1
- REST + OpenAPI is preferred over GraphQL
- Prisma is the standard ORM and migration tool for the backend
