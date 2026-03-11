import type { ModuleDescriptor } from "../module.types";
import { accessControlModule } from "./access-control";
import { configModule } from "./config";
import { dbModule } from "./db";
import { decoratorsModule } from "./decorators";
import { errorsModule } from "./errors";
import { eventsModule } from "./events";
import { guardsModule } from "./guards";
import { interceptorsModule } from "./interceptors";
import { observabilityModule } from "./observability";
import { requestContextModule } from "./request-context";

export const sharedModules: readonly ModuleDescriptor[] = [
  dbModule,
  requestContextModule,
  accessControlModule,
  guardsModule,
  decoratorsModule,
  interceptorsModule,
  eventsModule,
  configModule,
  observabilityModule,
  errorsModule
];
