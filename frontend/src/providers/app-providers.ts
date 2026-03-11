export interface AppProvidersContract {
  readonly purpose: string;
  readonly todo: readonly string[];
}

export const appProvidersContract: AppProvidersContract = {
  purpose: "Describe top-level provider composition for the web application.",
  todo: [
    "Add session provider.",
    "Add tenant context provider.",
    "Add data-fetching cache provider."
  ]
};
