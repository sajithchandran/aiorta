# Backend Workspace

This folder groups all backend concerns under one root so multiple services can share one dependency boundary and one backend-oriented structure.

Workspace behavior:
- `backend/` is now its own `pnpm` workspace root
- services live under `backend/services/*`
- shared backend packages live under `backend/shared/*`
- backend-local commands can be run from `backend/` without relying on the repository root workspace

Current layout:
- `services/api`: core NestJS API scaffold
- `services/analytics`: analytics service placeholder
- `services/ai-orchestrator`: AI orchestration service placeholder
- `shared`: backend-shared packages and support code
- `contracts`: backend-facing contract package placeholder
- `prisma`: canonical Prisma schema and migrations

TODO:
- add backend-local scripts for install, build, and dev workflows
- add actual service runtimes and shared packages as implementation begins
