# Backend Developer Runbook

This document explains how to install, compile, and run the backend services in the AIORTA repository.

## Backend Workspace

The backend is its own `pnpm` workspace rooted at [`/Users/sajithchandran/aira/aiorta/backend`](/Users/sajithchandran/aira/aiorta/backend).

Current backend services:
- `services/api`: NestJS core API
- `services/analytics`: placeholder for analytics service
- `services/ai-orchestrator`: placeholder for AI orchestration service

Current shared backend packages:
- `shared/config`
- `shared/types`
- `contracts`

## Prerequisites

Install these locally before running commands:
- Node.js 22.x or later
- `pnpm` 10.x
- PostgreSQL
- Redis

Optional but recommended:
- Prisma CLI available through workspace dependencies

## Install Dependencies

From the repository root:

```bash
pnpm install
```

From the backend workspace directly:

```bash
cd backend
pnpm install
```

Use one approach consistently. The backend workspace is designed so developers can work from `backend/` without depending on repo-root scripts.

## Backend Workspace Commands

From [`/Users/sajithchandran/aira/aiorta/backend`](/Users/sajithchandran/aira/aiorta/backend):

```bash
pnpm build
pnpm build:api
pnpm typecheck
pnpm typecheck:api
pnpm dev:api
```

What they do:
- `pnpm build`: builds the NestJS API service
- `pnpm build:api`: same as above, explicit service target
- `pnpm typecheck`: runs TypeScript typecheck for the API service
- `pnpm typecheck:api`: same as above, explicit service target
- `pnpm dev:api`: starts the NestJS API in watch mode

## API Service Commands

From [`/Users/sajithchandran/aira/aiorta/backend/services/api`](/Users/sajithchandran/aira/aiorta/backend/services/api):

```bash
pnpm build
pnpm start
pnpm start:dev
pnpm typecheck
```

These commands are defined in [`/Users/sajithchandran/aira/aiorta/backend/services/api/package.json`](/Users/sajithchandran/aira/aiorta/backend/services/api/package.json).

## Compile the Backend

Recommended path from the backend workspace:

```bash
cd backend
pnpm build
```

If you only want a compile check without emitting Nest build output:

```bash
cd backend
pnpm typecheck
```

## Run the Backend in Development

Recommended:

```bash
cd backend
pnpm dev:api
```

Direct service-level alternative:

```bash
cd backend/services/api
pnpm start:dev
```

The API bootstraps from [`/Users/sajithchandran/aira/aiorta/backend/services/api/src/main.ts`](/Users/sajithchandran/aira/aiorta/backend/services/api/src/main.ts).

Default behavior:
- global API prefix: `/api/v1`
- Swagger docs path: `/api/docs`

## Environment Variables

At minimum, the API needs values for:
- `DATABASE_URL`
- `JWT_SECRET`
- optional runtime settings such as port and JWT expiry

Current config access is defined in:
- [`/Users/sajithchandran/aira/aiorta/backend/services/api/src/config/configuration.ts`](/Users/sajithchandran/aira/aiorta/backend/services/api/src/config/configuration.ts)
- [`/Users/sajithchandran/aira/aiorta/backend/services/api/src/config/env.validation.ts`](/Users/sajithchandran/aira/aiorta/backend/services/api/src/config/env.validation.ts)
- [`/Users/sajithchandran/aira/aiorta/backend/services/api/src/config/app-config.service.ts`](/Users/sajithchandran/aira/aiorta/backend/services/api/src/config/app-config.service.ts)

If you add an `.env` file later, keep it aligned with those config definitions.

## Prisma Workflow

The canonical Prisma location is under:
- [`/Users/sajithchandran/aira/aiorta/backend/prisma`](/Users/sajithchandran/aira/aiorta/backend/prisma)

Typical workflow once the actual Prisma schema file is in place:

```bash
cd backend/services/api
pnpm prisma generate
pnpm prisma migrate dev
```

If Prisma commands are run from `backend/`, ensure the schema path and working directory are configured consistently.

## Typical Developer Flow

1. Install dependencies

```bash
pnpm install
```

2. Start required infrastructure
- PostgreSQL
- Redis

3. Run Prisma generate/migrations

4. Start the backend API

```bash
cd backend
pnpm dev:api
```

5. Verify the service
- open `http://localhost:<port>/api/docs`
- call `http://localhost:<port>/api/v1/...`

## Multi-Service Growth Pattern

The backend workspace is intentionally structured so future services can be added under:

```text
backend/services/<service-name>
```

Examples:
- `backend/services/api`
- `backend/services/analytics`
- `backend/services/ai-orchestrator`

Each new service should get:
- its own `package.json`
- its own build and dev scripts
- shared contracts/types via backend workspace packages rather than copying code

## Common Issues

### `nest: command not found`
Dependencies are not installed yet in the workspace.

Fix:

```bash
pnpm install
```

### `tsc: command not found`
TypeScript is not installed in the active workspace environment.

Fix:

```bash
pnpm install
```

### Prisma client import errors
The Prisma client has not been generated yet.

Fix:

```bash
cd backend/services/api
pnpm prisma generate
```

### Database connection errors
Check:
- `DATABASE_URL`
- PostgreSQL availability
- migration state

### Redis connection errors
Check:
- Redis is running
- future BullMQ configuration matches local ports

## Current Limitations

- `analytics` and `ai-orchestrator` are workspace placeholders only
- API compile/run depends on installing workspace dependencies first
- Prisma runtime setup is not fully wired until the concrete `schema.prisma` is placed in the backend Prisma path and client generation is run

## Recommended Developer Conventions

- use `backend/` as the default working directory for backend-only work
- use `backend/services/api/` only when debugging service-specific issues
- keep shared backend code in `backend/shared/*`
- keep service-specific code inside the owning service folder
- do not add cross-service relative imports when a shared package is more appropriate
