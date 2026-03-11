export interface ModuleDescriptor {
  readonly name: string;
  readonly layer: "domain" | "shared";
  readonly description: string;
  readonly todo: readonly string[];
}
