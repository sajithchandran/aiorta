import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>("port", 3000);
  }

  get nodeEnv(): string {
    return this.configService.get<string>("nodeEnv", "development");
  }

  get jwtSecret(): string {
    return this.configService.get<string>("jwtSecret", "change-me");
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>("jwtExpiresIn", "15m");
  }
}
