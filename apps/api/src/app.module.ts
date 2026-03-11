import type { ModuleDescriptor } from "./module.types";
import { domainModules } from "./modules/index";
import { sharedModules } from "./shared/index";

export interface ApiApplicationDescriptor {
  readonly name: "api";
  readonly modules: readonly ModuleDescriptor[];
}

export const apiApplication: ApiApplicationDescriptor = {
  name: "api",
  modules: [...domainModules, ...sharedModules]
};
