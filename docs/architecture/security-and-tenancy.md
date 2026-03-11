# Security and Tenancy

## Purpose
This document defines tenant isolation, authentication, authorization, PHI handling, audit requirements, and compliance posture for the platform.

## Security Objectives
- Prevent cross-tenant data leakage
- Prevent unauthorized project and dataset access inside a tenant
- Make all sensitive actions attributable
- Support future HIPAA, GDPR, DPDP, and Part 11 readiness
- Restrict AI use to governed, reviewable, PHI-safe patterns

## Tenant Model
Tenant types:
- `PERSONAL`
- `TEAM`
- `ORGANIZATION`

Rules:
- A user may belong to multiple tenants
- A request must resolve one active tenant
- Every tenant-owned record stores `tenant_id`
- Project records additionally store `project_id`
- Cross-tenant queries are forbidden by default

## Authentication Model
MVP recommendation:
- email/password authentication
- short-lived JWT access token
- server-managed refresh token or session record
- optional device/session metadata capture
- MFA-ready design even if not enabled on day one

Authentication outputs:
- `user_id`
- `session_id`
- `platform_role`
- active tenant context chosen by the client and verified by the API

## Session and Tenant Context
Every authenticated request must resolve:
- actor user
- active tenant
- project if route-scoped
- effective role set

Recommended context propagation:
- HTTP middleware resolves actor
- tenant guard confirms membership
- request context service exposes `user_id`, `tenant_id`, `project_id`, `roles`, `request_id`
- database session variables are set before repository work begins

## Authorization Model
Use layered authorization:

1. Platform role
- `PLATFORM_ADMIN`

2. Tenant role
- `INDIVIDUAL_DOCTOR`
- `PI`
- `CO_INVESTIGATOR`
- `STATISTICIAN`
- `DATA_MANAGER`
- `REVIEWER`
- `ORGANIZATION_ADMIN`

3. Project role
- narrower project-specific permission grants

4. Resource policy
- dataset approval
- analysis approval
- manuscript export approval
- AI draft review

## Authorization Rules
- Membership in tenant is necessary but not sufficient for project access
- Project access requires project membership or explicit inherited access policy
- Organization admins are governance-only in MVP
- Reviewer can review but not alter source data or role policies
- Statistician can run analyses but should not implicitly gain organization governance authority
- Platform admin access to tenant data should be tightly controlled and audited

## Policy Approach
Recommended model:
- RBAC for baseline permissions
- ABAC-like state checks for resource actions

Examples:
- only approved dataset versions may feed AI drafting
- only certain roles may approve manuscript export
- archived projects can remain readable but may reject mutation

## PostgreSQL RLS Strategy
RLS should apply to high-risk tenant-owned tables:
- projects
- forms
- imports
- cohorts
- datasets
- analyses
- manuscripts
- AI task metadata
- tenant-visible audit logs

Recommended database session settings:
- `app.user_id`
- `app.tenant_id`
- `app.platform_role`

Recommended policy pattern:
- tenant match must hold
- membership existence check for user-scoped access
- service accounts bypass via tightly controlled roles only for internal workers

Important rule:
- RLS is a defense layer, not the only layer; the application must still enforce explicit tenant scoping

## Object Storage Isolation
Binary objects live in S3-compatible storage. Isolation rules:
- bucket access is private only
- keys are prefixed by tenant and project
- URLs are signed and short-lived
- download actions are audited
- object metadata is stored in PostgreSQL
- untrusted uploads must be malware-scanned before processing

Example key layout:
- `tenant/{tenant_id}/project/{project_id}/imports/{import_batch_id}/source.xlsx`
- `tenant/{tenant_id}/project/{project_id}/datasets/{dataset_version_id}/snapshot.parquet`
- `tenant/{tenant_id}/project/{project_id}/analysis/{analysis_run_id}/table1.csv`

## Queue and Worker Security Context
All async jobs must carry:
- `tenant_id`
- `project_id`
- `actor_user_id`
- immutable resource ids
- correlation id

Worker rules:
- workers rehydrate authorization context before reads
- workers use scoped service credentials
- workers never accept naked tenant-external identifiers
- job payloads must avoid carrying raw PHI when identifiers suffice

## PHI Handling Policy
This platform handles sensitive healthcare data for research. MVP posture:
- least privilege access
- no unrestricted AI access to raw data
- no PHI in logs
- avoid putting direct identifiers into object names or queue payloads
- default AI mode is `PHI_MINIMIZED`
- de-identified or aggregate evidence only for external model calls

Recommended PHI categories:
- direct identifiers
- quasi-identifiers
- clinical attributes
- derived research variables
- aggregate outputs

Policy direction:
- direct identifiers should be minimized as early as possible
- manuscript and AI workflows should operate on aggregate outputs and approved metadata

## Audit and Access Logging
Mandatory audit coverage:
- login and session events
- tenant membership changes
- project creation and collaborator changes
- data upload and download
- cohort definition changes
- dataset version creation and approval
- analysis submission and completion
- AI draft generation and review
- manuscript edits, approvals, and export
- organization policy changes

Mandatory event fields:
- event id
- timestamp
- actor
- tenant
- project optional
- resource type and id
- action
- request id / correlation id
- network/session metadata
- outcome

Separate streams recommended:
- `audit_events`
- `data_access_events`
- `security_events`
- `approval_events`

## Compliance Readiness Posture
MVP is not claiming full certification or legal compliance completion, but architecture should support it.

Readiness goals:
- HIPAA direction: access control, auditability, least privilege, data minimization
- GDPR/DPDP direction: purpose limitation, data governance, retention hooks, export traceability
- Part 11 direction: versioning, attributable approvals, immutable history, review traceability

Deferred but prepared-for controls:
- enterprise SSO and SCIM
- configurable retention policies
- dual approval workflows
- field-level encryption for specific identifiers
- customer-managed keys

## Threat Priorities
- cross-tenant leakage
- intra-tenant overexposure
- signed URL misuse
- background job overreach
- AI prompt data exfiltration
- admin privilege creep
- mutable lineage artifacts undermining reproducibility

## Required Security Defaults for MVP
- deny by default
- explicit tenant context required
- no automatic organization-wide data visibility
- no AI access without approved evidence bundle
- no final export without human approval
- no unlogged sensitive data download

## Assumptions
- external LLM usage is limited to PHI-minimized evidence bundles
- direct hospital integrations are deferred, reducing connector attack surface in MVP
- platform admin operations touching tenant data will be rare and heavily audited
