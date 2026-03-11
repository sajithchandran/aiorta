# ADR 003: Governance-Only Organization Admins

## Context
Organization tenants need governance capabilities, but automatic visibility into all projects and PHI would create privacy risk and unclear institutional expectations.

## Decision
In MVP, `ORGANIZATION_ADMIN` is governance-only by default. Organization admins manage settings, policies, and membership, but do not automatically gain access to project data or PHI.

## Alternatives Considered
- full organization-wide data visibility
- configurable admin visibility in MVP

## Consequences
- lowers risk of overexposure
- may require explicit project grants for some operational users
- provides a safer default that can be expanded later if policy demands it
