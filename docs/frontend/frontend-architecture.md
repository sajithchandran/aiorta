# Frontend Architecture

## Purpose
This document defines the Next.js application structure, route map, workspace information architecture, and component organization for the research platform.

## Frontend Goals
- make tenant context explicit at all times
- support project-centric research workflows
- reduce navigation ambiguity across personal, team, and organization tenants
- expose review and approval states clearly
- make lineage and provenance visible where users make consequential decisions

## App Structure
Recommended app:
- Next.js App Router
- React + TypeScript
- Tailwind CSS
- shadcn/ui

Suggested source layout:

```text
apps/web/src/
  app/
    (marketing)/
    (auth)/
    t/[tenantSlug]/
      layout.tsx
      dashboard/
      projects/
        new/
        [projectId]/
          overview/
          team/
          forms/
          data/
            imports/
            mappings/
            datasets/
          cohorts/
          analyses/
          manuscripts/
          audit/
          settings/
      admin/
  components/
    ui/
    layout/
    tenants/
    projects/
    forms/
    data-ingestion/
    cohorts/
    datasets/
    analyses/
    manuscripts/
    ai/
    audit/
  features/
    auth/
    tenant-context/
    projects/
    collaborators/
    ingestion/
    cohort-builder/
    dataset-versioning/
    analyses/
    manuscript-editor/
    ai-drafting/
    approvals/
  lib/
    api/
    auth/
    permissions/
    schemas/
    utils/
  providers/
  hooks/
  types/
```

## Route Map
Top-level routes:
- `/login`
- `/select-tenant`
- `/t/[tenantSlug]/dashboard`
- `/t/[tenantSlug]/projects`
- `/t/[tenantSlug]/projects/new`
- `/t/[tenantSlug]/projects/[projectId]/overview`
- `/t/[tenantSlug]/projects/[projectId]/team`
- `/t/[tenantSlug]/projects/[projectId]/forms`
- `/t/[tenantSlug]/projects/[projectId]/data/imports`
- `/t/[tenantSlug]/projects/[projectId]/data/mappings`
- `/t/[tenantSlug]/projects/[projectId]/data/datasets`
- `/t/[tenantSlug]/projects/[projectId]/cohorts`
- `/t/[tenantSlug]/projects/[projectId]/analyses`
- `/t/[tenantSlug]/projects/[projectId]/manuscripts`
- `/t/[tenantSlug]/projects/[projectId]/audit`
- `/t/[tenantSlug]/projects/[projectId]/settings`
- `/t/[tenantSlug]/admin`

## Tenant-Aware Navigation Model
The tenant selector should be global and persistent in the app shell. The active tenant should be visible in:
- header
- project breadcrumbs
- permission/role UI
- invite flows

Rules:
- project lists must only show projects within the active tenant
- switching tenant should clear project-specific stale state
- deep links should validate slug-to-tenant access on load

## Dashboard Layout
Layout regions:
- top header with tenant switcher, search, alerts, user menu
- left navigation scoped to active tenant
- project workspace secondary navigation when inside a project
- main content area
- optional right rail for job status, AI context, or review tasks

## Project Workspace Information Architecture
Recommended tabs:
- Overview
- Team
- Forms
- Data
- Cohorts
- Analyses
- Manuscripts
- Audit
- Settings

Why:
- aligns with the data lifecycle
- keeps manuscript and AI work downstream of validated research assets

## Screen Inventory

### Dashboard
- tenant overview
- recent projects
- pending approvals
- recent imports
- analysis job status

### Project overview
- study metadata
- project status
- dataset summary
- latest approved analysis artifacts
- manuscript progress

### Team
- collaborator list
- invitations
- role badges
- project access review

### Data imports
- upload panel
- import history table
- parse status
- validation issues

### Variable mapping
- source columns panel
- canonical variables panel
- mapping status and warnings

### Datasets
- dataset list
- version timeline
- lineage drawer
- approval status

### Cohort builder
- criteria builder
- rule groups
- preview counts
- inclusion/exclusion explanation
- snapshot history

### Analyses
- analysis catalog
- parameter forms
- run queue
- result cards
- tables and figures gallery

### Manuscripts
- manuscript list
- section editor
- AI draft request panel
- evidence references
- approval checklist

### Audit
- filterable audit events
- sensitive access events
- export history

## Cohort Builder UX Structure
Recommended composition:
- left panel: criteria library
- center canvas: inclusion/exclusion rule builder
- right panel: preview summary and warnings
- bottom bar: save draft, preview count, snapshot actions

UX requirements:
- show rule grouping clearly
- show active source version
- show temporal logic in plain language
- warn when criteria reference unmapped or invalid variables

## Analytics Result Screens
Recommended sections:
- run summary header
- parameter and provenance card
- statistical result summaries
- tables tab
- figures tab
- approvals tab
- raw metadata tab for reproducibility

Users should be able to see:
- which dataset version was used
- which analysis spec ran
- when it ran
- whether outputs are approved for downstream AI use

## Manuscript Editor Screens
Recommended structure:
- manuscript version selector
- section outline sidebar
- main editor canvas
- evidence reference side panel
- AI drafting drawer
- validation and approval banner

Requirements:
- edits must preserve manuscript version history
- accepted AI text should remain attributable
- reviewer should be able to inspect evidence links inline or side-by-side

## Permissions-Aware Rendering
Frontend permission handling should:
- hide actions the user cannot perform
- disable controls for disallowed transitions
- show why an action is blocked when possible

But:
- backend remains the source of truth
- frontend checks are advisory for UX, not security enforcement

## Form, State, and Data Fetching Approach
Recommended:
- server components for initial layout and read-heavy pages where practical
- client components for interactive builders and editors
- typed API client in `lib/api`
- React Hook Form for complex forms
- Zod schemas shared where feasible for client validation

State boundaries:
- local UI state for builder interactions
- server-backed cache for lists/details
- long-running job status via polling or streaming later

## shadcn/ui Usage Strategy
Use shadcn/ui for:
- forms
- dialogs
- tables
- sheets/drawers
- tabs
- badges
- breadcrumbs
- command/search surfaces

Recommended custom composites:
- tenant switcher
- dataset lineage panel
- cohort criteria builder
- analysis artifact gallery
- evidence reference inspector
- approval checklist rail

## Design Direction
Because this is a professional healthcare research tool:
- prefer high-clarity typography and dense but readable layouts
- use status color sparingly and meaningfully
- avoid consumer-style playful interaction patterns
- make provenance and approval state highly visible

## Database / API Implications Exposed in UI
The UI must be built around immutable versions:
- dataset version selector instead of mutable single dataset view
- analysis run history instead of overwrite behavior
- manuscript version switching and comparison
- explicit approval badges and timeline views

## Assumptions
- App Router is used from the start
- tenant slug is stable and unique
- organization admin console is limited to governance and membership functions in MVP
