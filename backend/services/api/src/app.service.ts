import { Injectable } from "@nestjs/common";
import { AppConfigService } from "./config/app-config.service";

export interface HealthResponse {
  readonly status: "ok";
  readonly service: string;
  readonly environment: string;
}

@Injectable()
export class AppService {
  constructor(private readonly configService: AppConfigService) {}

  getHealth(): HealthResponse {
    return {
      status: "ok",
      service: "aiorta-api",
      environment: this.configService.nodeEnv
    };
  }
}
