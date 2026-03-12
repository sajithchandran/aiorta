import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { JobsModule } from "./jobs/jobs.module";
import { AuditModule } from "./audit/audit.module";
import { AiModule } from "./ai/ai.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { AppConfigModule } from "./config/app-config.module";
import { CohortsModule } from "./cohorts/cohorts.module";
import { CommonModule } from "./common/common.module";
import { DatasetsModule } from "./datasets/datasets.module";
import { DocumentsModule } from "./documents/documents.module";
import { GovernanceModule } from "./governance/governance.module";
import { ManuscriptsModule } from "./manuscripts/manuscripts.module";
import { MembershipsModule } from "./memberships/memberships.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProjectsModule } from "./projects/projects.module";
import { ProtocolsModule } from "./protocols/protocols.module";
import { RolesModule } from "./roles/roles.module";
import { TenantsModule } from "./tenants/tenants.module";
import { UsersModule } from "./users/users.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { AuditInterceptor } from "./common/interceptors/audit.interceptor";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";

@Module({
  imports: [
    AppConfigModule,
    CommonModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    TenantsModule,
    MembershipsModule,
    RolesModule,
    ProjectsModule,
    ProtocolsModule,
    DocumentsModule,
    CohortsModule,
    DatasetsModule,
    AnalyticsModule,
    ManuscriptsModule,
    AiModule,
    GovernanceModule,
    AuditModule,
    JobsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ]
})
export class AppModule {}
