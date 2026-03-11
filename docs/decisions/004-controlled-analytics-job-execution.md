# ADR 004: Controlled Analytics Job Execution

## Context
The platform must support reproducible analytics and journal-grade outputs. Arbitrary notebook execution would make provenance and environment control much harder in MVP.

## Decision
Use a controlled job-spec based analytics execution model in a Python service. Persist dataset version, parameters, code or image version, runtime metadata, and output artifacts for every run.

## Alternatives Considered
- embedded in-process analytics in NestJS
- user-authored notebooks
- fully external analytics platform integration

## Consequences
- stronger reproducibility
- narrower initial flexibility
- cleaner approval and audit model for downstream AI and manuscripts
