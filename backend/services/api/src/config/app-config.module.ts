import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { resolve } from "node:path";
import configuration from "./configuration";
import { validateEnvironment } from "./env.validation";
import { AppConfigService } from "./app-config.service";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        resolve(process.cwd(), "../../.env"),
        resolve(process.cwd(), "../../.env.example")
      ],
      load: [configuration],
      validate: validateEnvironment
    })
  ],
  providers: [AppConfigService],
  exports: [AppConfigService]
})
export class AppConfigModule {}
