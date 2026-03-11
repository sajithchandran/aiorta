# Modules and Features

## Purpose
This document catalogs the product modules, primary features, intended roles, dependencies, and MVP boundaries.

## Identity and Tenant Management
User-facing capabilities:
- sign in
- switch active tenant
- view memberships
- create personal, team, or organization tenant
- invite collaborators

Primary roles:
- all users
- organization admin
- platform admin

MVP:
- in scope

Later:
- SSO
- SCIM
- enterprise directory sync

Dependencies:
- audit
- access control

Acceptance boundaries:
- user can belong to multiple tenants
- user sees only tenants they belong to
- org admin can manage membership without default project PHI visibility

## Research Project Workspace
User-facing capabilities:
- create project
- define study metadata
- manage project collaborators
- navigate research assets in one workspace

Primary roles:
- individual doctor
- PI
- co-investigator
- statistician
- data manager

MVP:
- in scope

Later:
- reusable study templates
- cross-project reporting

Dependencies:
- identity and tenancy

Acceptance boundaries:
- project belongs to exactly one tenant
- project memberships can refine tenant permissions

## eCRF / Form Builder
User-facing capabilities:
- define research forms
- create fields and validations
- capture manual data

Primary roles:
- PI
- data manager

MVP:
- limited or foundational scope depending delivery capacity

Later:
- repeating instruments
- conditional logic
- multi-visit schedules

Dependencies:
- projects
- variables

Acceptance boundaries:
- form schema is versioned
- submissions are attributable and tenant-scoped

## Data Ingestion
User-facing capabilities:
- upload CSV/Excel
- inspect parse status
- review validation issues
- map source columns to research variables

Primary roles:
- doctor
- statistician
- data manager

MVP:
- in scope

Later:
- FHIR ingestion
- database connectors
- scheduled syncs

Dependencies:
- storage
- jobs
- audit
- variables

Acceptance boundaries:
- source file and import metadata are immutable
- unresolved mapping issues block downstream materialization

## Cohort Builder
User-facing capabilities:
- define inclusion/exclusion criteria
- preview counts
- save reusable cohort definitions
- snapshot cohorts for reproducibility

Primary roles:
- PI
- co-investigator
- statistician

MVP:
- in scope

Later:
- reusable cohort templates
- advanced temporal logic packs

Dependencies:
- ingestion
- variables
- datasets

Acceptance boundaries:
- cohort definitions are editable drafts
- snapshots are immutable

## Dataset Versioning
User-facing capabilities:
- materialize analysis-ready datasets
- inspect dataset lineage
- compare versions
- approve datasets for downstream use

Primary roles:
- statistician
- data manager
- PI

MVP:
- in scope

Later:
- derived variable pipelines
- reusable transformation recipes

Dependencies:
- cohorts
- ingestion
- approvals

Acceptance boundaries:
- versions are immutable
- approval is explicit
- row count, checksum, schema metadata, and lineage are persisted

## Analytics Engine
User-facing capabilities:
- run descriptive stats
- run group comparisons
- run regression
- run survival analysis
- generate publication tables and figures

Primary roles:
- statistician
- PI
- co-investigator

MVP:
- in scope

Later:
- custom model libraries
- more advanced causal inference workflows

Dependencies:
- datasets
- jobs
- storage

Acceptance boundaries:
- all runs are reproducible by job spec
- outputs are versioned and attributable

## AI Orchestration
User-facing capabilities:
- request draft sections
- review evidence-linked AI outputs
- inspect validation warnings

Primary roles:
- PI
- co-investigator
- reviewer

MVP:
- in scope with PHI-minimized mode only

Later:
- private model deployment
- organization-specific prompt policies
- revision memory across manuscript versions

Dependencies:
- datasets
- analyses
- manuscripts
- approvals

Acceptance boundaries:
- only approved EvidenceBundle inputs
- no unsupported claim passes silently

## Manuscript Generation and Editing
User-facing capabilities:
- create manuscript
- manage sections
- accept or revise AI drafts
- attach approved tables/figures
- approve export

Primary roles:
- PI
- co-investigator
- reviewer

MVP:
- in scope

Later:
- journal-specific export styles
- collaborative comments
- tracked changes workflow

Dependencies:
- analyses
- AI orchestration
- approvals

Acceptance boundaries:
- manuscript versions are preserved
- final export requires approval

## Audit and Compliance
User-facing capabilities:
- review activity logs
- inspect approval history
- inspect export history

Primary roles:
- organization admin
- reviewer
- platform admin

MVP:
- in scope

Later:
- retention policies
- legal hold workflows
- anomaly alerts

Dependencies:
- all modules

Acceptance boundaries:
- sensitive writes and data access are attributable
- events are tenant and project scoped where applicable

## Module Dependency Summary
Upstream foundation:
- identity and tenant management
- audit
- storage
- jobs

Research workflow chain:
- projects -> ingestion -> cohorts -> datasets -> analyses -> manuscripts -> AI-assisted drafting

Governance overlays:
- approvals
- audit
- access control

## MVP Must-Have Feature Set
- multi-tenant membership
- project workspace
- collaborator roles
- upload and mapping
- cohort definition and snapshot
- dataset versioning
- core statistical jobs
- publication artifacts
- grounded AI drafts
- manuscript review and export approval

## Deferred Features
- FHIR connectors
- direct database connectors
- self-hosted LLM mode
- enterprise SSO/SCIM
- complex eCRF scheduling
- multi-site federation

## Assumptions
- MVP is intentionally centered on upload-driven research workflows
- form builder may be narrower in v1 than the ingestion and analytics path
