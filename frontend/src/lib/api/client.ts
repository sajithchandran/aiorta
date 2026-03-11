export interface ApiClientContract {
  readonly basePath: "/api/v1";
  readonly todo: readonly string[];
}

export const apiClientContract: ApiClientContract = {
  basePath: "/api/v1",
  todo: [
    "Implement typed request helpers.",
    "Add tenant-aware header and path utilities."
  ]
};
