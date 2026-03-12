import { Injectable, NotImplementedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCohortDto } from "./dto/create-cohort.dto";
import { CreateCohortRuleDto } from "./dto/create-cohort-rule.dto";
import { QueryCohortsDto } from "./dto/query-cohorts.dto";

@Injectable()
export class CohortsService {
  constructor(private readonly prisma: PrismaService) {}

  createCohort(tenantId: string, projectId: string, actorUserId: string, payload: CreateCohortDto): never {
    void this.prisma.buildTenantWhere(tenantId, { projectId });
    void actorUserId;
    void payload;
    // TODO: Persist Cohort and initial metadata within the project boundary.
    throw new NotImplementedException("Cohort creation is not implemented yet.");
  }

  addRule(tenantId: string, projectId: string, cohortId: string, payload: CreateCohortRuleDto): never {
    void this.prisma.buildTenantWhere(tenantId, { projectId, id: cohortId });
    void payload;
    // TODO: Persist CohortRule tree nodes with nested AND/OR semantics.
    throw new NotImplementedException("Cohort rule creation is not implemented yet.");
  }

  listCohorts(tenantId: string, projectId: string, query: QueryCohortsDto): never {
    void this.prisma.buildTenantWhere(tenantId, { projectId });
    void query;
    // TODO: Return tenant- and project-scoped cohort summaries.
    throw new NotImplementedException("Cohort listing is not implemented yet.");
  }

  previewCohort(tenantId: string, projectId: string, cohortId: string): never {
    void this.prisma.buildTenantWhere(tenantId, { projectId, id: cohortId });
    // TODO: Trigger read-only preview metadata evaluation without materializing a snapshot.
    throw new NotImplementedException("Cohort preview is not implemented yet.");
  }
}
