import type { FrontendAreaDescriptor } from "../feature.types";
import { analysesFeature } from "./analyses";
import { approvalsFeature } from "./approvals";
import { authFeature } from "./auth";
import { collaboratorsFeature } from "./collaborators";
import { cohortBuilderFeature } from "./cohort-builder";
import { datasetVersioningFeature } from "./dataset-versioning";
import { ingestionFeature } from "./ingestion";
import { manuscriptEditorFeature } from "./manuscript-editor";
import { projectsFeature } from "./projects";
import { tenantContextFeature } from "./tenant-context";

export const frontendFeatures: readonly FrontendAreaDescriptor[] = [
  authFeature,
  tenantContextFeature,
  projectsFeature,
  collaboratorsFeature,
  ingestionFeature,
  cohortBuilderFeature,
  datasetVersioningFeature,
  analysesFeature,
  manuscriptEditorFeature,
  approvalsFeature
];
