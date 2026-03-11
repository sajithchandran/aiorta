# ADR 005: PHI-Minimized AI for MVP

## Context
The platform uses AI for manuscript drafting, but external provider usage creates privacy and compliance risk if raw PHI is exposed.

## Decision
Restrict MVP AI usage to `PHI_MINIMIZED` evidence bundles composed of approved metadata and aggregate outputs only. No raw patient-level data is sent to external models.

## Alternatives Considered
- unrestricted AI drafting over project data
- private model deployment in MVP
- no AI until a private model stack exists

## Consequences
- allows early AI value with lower privacy risk
- requires evidence bundle and validation infrastructure from the start
- some advanced drafting use cases are deferred until private deployment modes exist
