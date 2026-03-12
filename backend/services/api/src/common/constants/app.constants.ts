export const AUTH_PUBLIC_KEY = "isPublicRoute";
export const PERMISSIONS_KEY = "permissions";
export const TENANT_HEADER_KEY = "x-tenant-id";
export const REQUEST_ID_HEADER_KEY = "x-request-id";

export const JOB_QUEUE_NAMES = {
  datasetMaterialization: "dataset-materialization",
  analysisExecution: "analysis-execution",
  manuscriptGeneration: "manuscript-generation",
  aiReview: "ai-review"
} as const;
