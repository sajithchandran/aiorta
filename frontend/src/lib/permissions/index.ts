export interface PermissionContract {
  readonly purpose: string;
  readonly todo: readonly string[];
}

export const permissionContract: PermissionContract = {
  purpose: "Frontend advisory permission checks based on resolved actor roles.",
  todo: [
    "Add permission predicates.",
    "Map backend permission results into UI affordances."
  ]
};
