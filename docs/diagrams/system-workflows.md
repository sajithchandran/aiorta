# System Workflows

## System Context
```mermaid
flowchart LR
  User["Doctor / Researcher"] --> Web["Next.js Web App"]
  Web --> API["NestJS Core API"]
  API --> PG["PostgreSQL"]
  API --> S3["S3-Compatible Object Storage"]
  API --> Redis["Redis / BullMQ"]
  Redis --> Analytics["Python Analytics Service"]
  API --> AI["AI Orchestration Service"]
  AI --> Providers["LLM Providers"]
```

## Tenant and Project Interaction
```mermaid
flowchart TD
  A["User"] --> B["Select active tenant"]
  B --> C["List tenant projects"]
  C --> D["Open project workspace"]
  D --> E["Use project resources under tenant scope"]
```

## Data Lifecycle
```mermaid
flowchart TD
  A["Upload CSV / Excel"] --> B["Parse and validate"]
  B --> C["Map source columns"]
  C --> D["Define cohort"]
  D --> E["Snapshot cohort"]
  E --> F["Materialize DatasetVersion"]
  F --> G["Run AnalysisRun"]
  G --> H["Approve outputs"]
  H --> I["Build EvidenceBundle"]
  I --> J["AI draft"]
  J --> K["Review ManuscriptVersion"]
  K --> L["Approve export"]
```

## Cohort to Dataset Flow
```mermaid
flowchart LR
  Source["Approved source import"] --> Cohort["CohortDefinition"]
  Cohort --> Snapshot["CohortSnapshot"]
  Snapshot --> Dataset["DatasetVersion"]
  Dataset --> Approval["Dataset approval"]
```

## Analytics Job Flow
```mermaid
sequenceDiagram
  participant UI
  participant API
  participant Queue
  participant Worker
  participant DB

  UI->>API: Submit analysis request
  API->>DB: Create AnalysisJob
  API->>Queue: Enqueue job
  Queue->>Worker: Deliver job
  Worker->>DB: Load DatasetVersion + spec
  Worker->>DB: Store AnalysisRun + outputs
  UI->>API: Poll run status
  API-->>UI: Return outputs and state
```

## AI Draft Review Flow
```mermaid
flowchart TD
  A["Request AI draft"] --> B["Assemble EvidenceBundle"]
  B --> C["Policy and PHI gate"]
  C --> D["Generate with provider"]
  D --> E["Validate claims"]
  E --> F{"Supported?"}
  F -->|No| G["Flag for correction"]
  F -->|Yes| H["Ready for review"]
  H --> I["Human accept / revise / reject"]
```

## Manuscript Approval and Export Flow
```mermaid
flowchart TD
  A["Manuscript draft"] --> B["Section review"]
  B --> C["Approval checklist"]
  C --> D{"Approved for export?"}
  D -->|No| E["Return to editing"]
  D -->|Yes| F["Generate export package"]
  F --> G["Audit export"]
```
