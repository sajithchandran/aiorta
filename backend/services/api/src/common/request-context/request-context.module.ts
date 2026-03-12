import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { RequestContextService } from "./request-context.service";
import { RequestContextMiddleware } from "./request-context.middleware";
import { TenantContextResolver } from "./tenant-context.resolver";

@Module({
  providers: [RequestContextService, TenantContextResolver],
  exports: [RequestContextService, TenantContextResolver]
})
export class RequestContextModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware).forRoutes("*");
  }
}
