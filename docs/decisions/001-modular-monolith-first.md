# ADR 001: Modular Monolith First

## Context
The platform has tightly coupled domains: tenancy, projects, cohorts, datasets, analyses, manuscripts, approvals, and audit. Splitting these too early into microservices would increase operational complexity and make transactional consistency harder.

## Decision
Build the core platform as a modular monolith in NestJS. Isolate heavy analytics execution and AI provider orchestration behind separate runtime boundaries only where needed.

## Alternatives Considered
- Full microservices by domain
- Single process including analytics execution
- Backend-for-frontend plus separate domain services

## Consequences
- Faster MVP delivery
- Stronger consistency for security and audit-sensitive workflows
- Lower operational burden
- Requires disciplined module boundaries inside the monolith
