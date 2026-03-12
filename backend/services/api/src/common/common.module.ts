import { Global, Module } from "@nestjs/common";
import { RequestContextModule } from "./request-context/request-context.module";
import { PermissionsGuard } from "./guards/permissions.guard";
import { TenantMembershipGuard } from "./guards/tenant-membership.guard";

@Global()
@Module({
  imports: [RequestContextModule],
  providers: [TenantMembershipGuard, PermissionsGuard],
  exports: [RequestContextModule, TenantMembershipGuard, PermissionsGuard]
})
export class CommonModule {}
