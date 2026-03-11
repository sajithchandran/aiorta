# ADR 002: Shared Schema with RLS

## Context
Users can belong to multiple tenants, and the product must support personal, team, and organization workspaces without excessive operational complexity. Isolation remains critical because healthcare research data is sensitive.

## Decision
Use a shared PostgreSQL schema with explicit `tenant_id` scoping and PostgreSQL Row Level Security on high-risk tables.

## Alternatives Considered
- schema-per-tenant
- database-per-tenant
- application-only isolation without RLS

## Consequences
- simpler operations and migrations in MVP
- easier support for users in multiple tenants
- strong need for disciplined query scoping and session variable handling
- RLS becomes an additional safety layer rather than the sole control
