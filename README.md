# AIORTA Monorepo Scaffold

This repository contains the initial scaffold for the AI-native clinical research platform described in `docs/`.

Current status:
- monorepo workspace layout created
- top-level `backend/` and `frontend/` folder structure scaffolded
- Prisma selected as the backend ORM
- placeholder module and feature READMEs added
- no business logic implemented yet

Repository layout:
- `backend/`: backend service workspace, shared backend packages, and Prisma schema
- `frontend/`: Next.js frontend application scaffold
- `docs/`: architecture and product documentation
- `infra/`: infrastructure placeholders

TODO:
- install workspace dependencies
- generate NestJS and Next.js runtime wiring
- add Prisma schema in Phase 2
