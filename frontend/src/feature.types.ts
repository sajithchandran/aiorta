export interface FrontendAreaDescriptor {
  readonly name: string;
  readonly category: "route" | "feature" | "component" | "library";
  readonly description: string;
  readonly todo: readonly string[];
}
