import type { ModuleDescriptor } from "../module.types";
import { analysesModule } from "./analyses";
import { aiOrchestrationModule } from "./ai-orchestration";
import { approvalsModule } from "./approvals";
import { auditModule } from "./audit";
import { authModule } from "./auth";
import { cohortsModule } from "./cohorts";
import { datasetsModule } from "./datasets";
import { formsModule } from "./forms";
import { identityModule } from "./identity";
import { ingestionModule } from "./ingestion";
import { jobsModule } from "./jobs";
import { membershipsModule } from "./memberships";
import { manuscriptsModule } from "./manuscripts";
import { notificationsModule } from "./notifications";
import { platformAdminModule } from "./platform-admin";
import { projectsModule } from "./projects";
import { storageModule } from "./storage";
import { studiesModule } from "./studies";
import { tenantsModule } from "./tenants";
import { variablesModule } from "./variables";

export const domainModules: readonly ModuleDescriptor[] = [
  authModule,
  identityModule,
  tenantsModule,
  membershipsModule,
  projectsModule,
  studiesModule,
  formsModule,
  variablesModule,
  ingestionModule,
  cohortsModule,
  datasetsModule,
  analysesModule,
  manuscriptsModule,
  aiOrchestrationModule,
  approvalsModule,
  auditModule,
  storageModule,
  jobsModule,
  notificationsModule,
  platformAdminModule
];
