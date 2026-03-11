import { apiApplication } from "./app.module";

export function describeApiApplication(): string {
  const moduleNames = apiApplication.modules.map((moduleDescriptor) => moduleDescriptor.name);

  return [
    "AIORTA backend scaffold",
    `registered modules: ${moduleNames.join(", ")}`
  ].join("\n");
}

// TODO: Replace this placeholder entrypoint with NestFactory bootstrap wiring.
