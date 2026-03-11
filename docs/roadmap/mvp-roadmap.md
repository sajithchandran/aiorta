# MVP Roadmap

## Purpose
This document defines the phased build sequence, risks, and delivery milestones for the MVP and immediate follow-on work.

## v1 Must-Have Features
- identity and multi-tenant membership
- personal, team, and organization tenants
- project creation under any tenant
- project collaborator roles
- CSV/Excel upload
- source parsing and validation issue capture
- variable mapping
- cohort definition and snapshot
- immutable dataset versions with lineage and approval
- descriptive statistics, group comparisons, regression, survival analysis
- Table 1 and standard publication figures
- AI-assisted Methods, Results, and Discussion drafting from approved evidence only
- manuscript versioning and export approval
- append-only audit for sensitive actions

## v2 Additions
- FHIR ingestion
- database connectors
- stronger eCRF builder capabilities
- richer manuscript collaboration
- advanced analysis catalog
- organization policy customization
- private model deployment options

## Deferred Features
- notebook-style arbitrary compute
- direct clinical workflow integration
- automatic external citation generation
- cross-institution data federation
- advanced de-identification orchestration
- full compliance program implementation artifacts

## Delivery Sequence

### Phase A: Foundation
- establish monorepo
- implement auth
- implement tenant model and membership
- implement request context and access control primitives
- implement audit event framework

Milestone:
- user can sign in, switch tenants, and create/view a tenant-scoped project

### Phase B: Project and Ingestion
- build project workspace shell
- implement file registration and storage
- implement import parsing jobs
- implement variable mapping workflow
- expose validation issues in UI

Milestone:
- user can upload data into a project and reach an approved mapping state

### Phase C: Cohorts and Datasets
- implement cohort definition model
- implement preview and snapshot flow
- implement dataset materialization and lineage capture
- implement dataset approval workflow

Milestone:
- user can produce an approved immutable DatasetVersion from uploaded source data

### Phase D: Analytics
- implement analysis catalog and specs
- queue analysis jobs to Python service
- store reproducibility metadata
- render standard tables and figures
- implement output approval

Milestone:
- user can run a reproducible analysis and approve outputs for downstream use

### Phase E: Manuscripts and AI
- implement manuscript model and editor shell
- implement EvidenceBundle assembly
- implement AI draft tasks and validation
- implement review and acceptance workflow
- implement export approval

Milestone:
- user can generate reviewable manuscript drafts grounded in approved evidence

### Phase F: Hardening
- access audit UX
- operational reporting
- security controls hardening
- performance and failure testing
- documentation and onboarding

Milestone:
- MVP is ready for controlled pilot usage

## Recommended First Build Order
1. auth, tenancy, RBAC, audit framework
2. project workspace and collaborator model
3. upload intake and mapping
4. cohort snapshot and dataset versioning
5. analytics execution and artifact approval
6. manuscript workflow and AI drafting
7. hardening and admin views

## Technical Risks
- underestimating tenant-aware data access complexity
- weak lineage model forcing redesign during analytics or manuscript work
- analysis environment drift reducing reproducibility
- overbuilding forms before the ingestion-analytics path is stable
- insufficient queue/job observability for long-running research workflows

## Security Risks
- cross-tenant query mistakes
- PHI exposure through logs, exports, or AI prompts
- organization admin privilege expansion by accident
- signed URL misuse or excessive TTLs
- unscanned uploads introducing malware or unsafe files

## Architectural Risks
- trying to split into microservices too early
- conflating mutable working data with immutable approved artifacts
- allowing AI to bypass approval boundaries
- coupling UI too tightly to one ORM or internal persistence model

## Risk Mitigations
- require explicit tenant context everywhere
- use RLS for high-risk tables
- capture immutable versions early
- isolate analytics and AI execution boundaries
- make approvals and audit visible in UI and backend contracts

## Readiness Milestones

### Milestone 1: Secure workspace foundation
Acceptance:
- tenant isolation proven in API and DB
- project collaboration works
- audit events exist for sensitive actions

### Milestone 2: Reproducible data path
Acceptance:
- import to dataset version path is complete
- dataset lineage is queryable
- dataset approval gate works

### Milestone 3: Reproducible evidence generation
Acceptance:
- analyses execute reproducibly
- tables and figures are versioned and reviewable
- approved outputs can be assembled into EvidenceBundle

### Milestone 4: Grounded AI manuscript workflow
Acceptance:
- AI drafts link to evidence
- validation catches unsupported claims
- final export requires human approval

## Assumptions
- a narrow but reliable v1 is preferable to a wide but weakly governed platform
- pilot customers will accept upload-first workflows in exchange for faster time to value
