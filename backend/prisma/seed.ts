import {
  AIJobStatus,
  AIJobType,
  AIOutputStatus,
  AIReviewDecision,
  AnalysisResultType,
  AnalysisRunStatus,
  ApprovalStatus,
  ApprovalTargetType,
  ArtifactStatus,
  CohortRuleNodeType,
  CohortStatus,
  ComparisonOperator,
  DatasetStatus,
  DatasetVersionStatus,
  LogicalOperator,
  ManuscriptSectionType,
  Permission,
  Prisma,
  PrismaClient,
  ProjectStatus,
  RoleScope,
  StatisticalPlanStatus,
  TenantType
} from "@prisma/client";

const prisma = new PrismaClient();

const DEV_USER_ID = "f2b28b8f-cf34-4349-a9a2-e2d0b7f55601";
const DEV_TENANT_ID = "0d57efb9-9b27-42c8-b93c-21f7ce95c1e1";
const DEV_PROJECT_ID = "d4530a80-d874-45fc-821e-fc815dbd37d6";
const DEV_COHORT_ID = "22a27807-9b4a-40fc-a20c-fda39f7078b7";
const DEV_COHORT_RULE_ID = "a3421999-e78a-4dfd-9998-cff29bdb42cd";
const DEV_DATASET_ID = "63bf354f-f4f8-4845-b91b-94d0996be4d8";
const DEV_DATASET_VERSION_ID = "7a0c3f7f-6958-4261-9e11-ef4a63f8afba";
const DEV_PLAN_ID = "9dc0fc16-855f-4441-a3f0-3c6e3c9d9541";
const DEV_ANALYSIS_RUN_ID = "341d77ce-d0bd-4780-8424-d77961e677e3";
const DEV_ANALYSIS_RESULT_ID = "80cd56ab-65d0-4517-bb29-f68f8d16ef34";
const DEV_TABLE_ID = "1e326eca-36fa-4e0a-9d0b-a9d9a2050a6c";
const DEV_FIGURE_ID = "fd61bc3a-b996-43f7-a872-7baecf9fb811";
const DEV_MANUSCRIPT_ID = "30027f88-02ec-4ad0-bca1-af583869f19c";
const DEV_MANUSCRIPT_VERSION_ID = "0cfd0b3a-c00f-438d-9c87-29b00ad6ff61";
const DEV_RESULTS_SECTION_ID = "0cc81c40-cb4b-47d4-8158-f0313420838c";
const DEV_AI_JOB_ID = "9b62f4bc-7385-4a3b-9155-f68f7f804de8";
const DEV_AI_OUTPUT_ID = "7170dce7-d5b6-44ef-8d4f-bea29c177713";
const DEV_AI_REVIEW_ID = "b6be6cbe-41a4-437c-ac59-1b96225d749f";
const DEV_APPROVAL_ID = "6eb6cefe-1193-44c0-a55d-3f0d19642bba";
const TENANT_OWNER_ROLE_ID = "712bf437-9cda-4a54-a4c7-26a4fd203007";
const PROJECT_PI_ROLE_ID = "f6d1d2f2-d8f3-4d11-bfd0-f4c49ef2147f";
const REVIEWER_ROLE_ID = "6188ba59-4f33-4d84-83aa-8af24d5e3eec";

const DEV_USER_EMAIL = "dev@aiorta.dev";
const DEV_PASSWORD = "DevPassword123!";
const DEV_PASSWORD_HASH =
  "$2b$10$SUrzrERtSv9ZiOPYKOxQGesxvPJZTZ6WsZoHv8Z0e9bAVXgCaE1uu";

const permissions: Array<Pick<Permission, "key" | "name" | "description">> = [
  {
    key: "TENANT_READ",
    name: "Read tenant resources",
    description: "Read tenant-scoped members and users."
  },
  {
    key: "TENANT_UPDATE",
    name: "Update tenant resources",
    description: "Manage tenant-scoped members and users."
  },
  {
    key: "PROJECT_CREATE",
    name: "Create projects",
    description: "Create projects within a tenant."
  },
  {
    key: "PROJECT_READ",
    name: "Read projects",
    description: "Read project-scoped research assets."
  },
  {
    key: "PROJECT_UPDATE",
    name: "Update projects",
    description: "Update project metadata and governance state."
  },
  {
    key: "PROJECT_ARCHIVE",
    name: "Archive projects",
    description: "Archive projects."
  },
  {
    key: "COHORT_CREATE",
    name: "Create cohorts",
    description: "Create and manage cohorts."
  },
  {
    key: "DATASET_CREATE",
    name: "Create datasets",
    description: "Create datasets and dataset versions."
  },
  {
    key: "ANALYSIS_RUN_CREATE",
    name: "Create analysis runs",
    description: "Create statistical plans and analysis runs."
  },
  {
    key: "MANUSCRIPT_CREATE",
    name: "Create manuscripts",
    description: "Create manuscripts and versions."
  },
  {
    key: "AI_JOB_CREATE",
    name: "Create AI jobs",
    description: "Create AI drafting and review jobs."
  },
  {
    key: "AUDIT_READ",
    name: "Read audit logs",
    description: "Read audit and access logs."
  }
];

async function main(): Promise<void> {
  const now = new Date();

  const permissionRecords = new Map<string, string>();

  for (const permission of permissions) {
    const record = await prisma.permission.upsert({
      where: {
        key: permission.key
      },
      update: {
        name: permission.name,
        description: permission.description,
        deletedAt: null
      },
      create: {
        key: permission.key,
        name: permission.name,
        description: permission.description
      }
    });

    permissionRecords.set(record.key, record.id);
  }

  await prisma.role.upsert({
    where: { key: "TENANT_OWNER" },
    update: {
      name: "Tenant Owner",
      scope: RoleScope.TENANT,
      isSystem: true,
      deletedAt: null
    },
    create: {
      id: TENANT_OWNER_ROLE_ID,
      name: "Tenant Owner",
      key: "TENANT_OWNER",
      scope: RoleScope.TENANT,
      isSystem: true
    }
  });

  await prisma.role.upsert({
    where: { key: "PROJECT_PI" },
    update: {
      name: "Project PI",
      scope: RoleScope.PROJECT,
      isSystem: true,
      deletedAt: null
    },
    create: {
      id: PROJECT_PI_ROLE_ID,
      name: "Project PI",
      key: "PROJECT_PI",
      scope: RoleScope.PROJECT,
      isSystem: true
    }
  });

  await prisma.role.upsert({
    where: { key: "REVIEWER" },
    update: {
      name: "Reviewer",
      scope: RoleScope.PROJECT,
      isSystem: true,
      deletedAt: null
    },
    create: {
      id: REVIEWER_ROLE_ID,
      name: "Reviewer",
      key: "REVIEWER",
      scope: RoleScope.PROJECT,
      isSystem: true
    }
  });

  const allPermissionKeys = permissions.map((permission) => permission.key);
  const reviewerPermissionKeys = ["TENANT_READ", "PROJECT_READ", "AUDIT_READ"];

  await seedRolePermissions(TENANT_OWNER_ROLE_ID, allPermissionKeys, permissionRecords);
  await seedRolePermissions(PROJECT_PI_ROLE_ID, allPermissionKeys, permissionRecords);
  await seedRolePermissions(REVIEWER_ROLE_ID, reviewerPermissionKeys, permissionRecords);

  await prisma.user.upsert({
    where: { email: DEV_USER_EMAIL },
    update: {
      fullName: "AIORTA Dev User",
      passwordHash: DEV_PASSWORD_HASH,
      isActive: true,
      deletedAt: null,
      tenantId: DEV_TENANT_ID
    },
    create: {
      id: DEV_USER_ID,
      tenantId: DEV_TENANT_ID,
      createdById: DEV_USER_ID,
      email: DEV_USER_EMAIL,
      fullName: "AIORTA Dev User",
      passwordHash: DEV_PASSWORD_HASH,
      isActive: true
    }
  });

  await prisma.tenant.upsert({
    where: { slug: "aiorta-dev" },
    update: {
      tenantId: DEV_TENANT_ID,
      name: "AIORTA Dev Tenant",
      type: TenantType.ORGANIZATION,
      createdById: DEV_USER_ID,
      isActive: true,
      deletedAt: null
    },
    create: {
      id: DEV_TENANT_ID,
      tenantId: DEV_TENANT_ID,
      createdById: DEV_USER_ID,
      name: "AIORTA Dev Tenant",
      slug: "aiorta-dev",
      type: TenantType.ORGANIZATION,
      isActive: true
    }
  });

  await upsertTenantMembership({
    tenantId: DEV_TENANT_ID,
    userId: DEV_USER_ID,
    roleId: TENANT_OWNER_ROLE_ID,
    createdById: DEV_USER_ID
  });

  await prisma.project.upsert({
    where: {
      tenantId_slug: {
        tenantId: DEV_TENANT_ID,
        slug: "heart-failure-outcomes"
      }
    },
    update: {
      title: "Heart Failure Outcomes Study",
      code: "HF-001",
      description: "Seeded development study for frontend integration.",
      status: ProjectStatus.ACTIVE,
      deletedAt: null
    },
    create: {
      id: DEV_PROJECT_ID,
      tenantId: DEV_TENANT_ID,
      createdById: DEV_USER_ID,
      title: "Heart Failure Outcomes Study",
      code: "HF-001",
      slug: "heart-failure-outcomes",
      description: "Seeded development study for frontend integration.",
      status: ProjectStatus.ACTIVE
    }
  });

  await upsertProjectMember({
    tenantId: DEV_TENANT_ID,
    projectId: DEV_PROJECT_ID,
    userId: DEV_USER_ID,
    roleId: PROJECT_PI_ROLE_ID,
    createdById: DEV_USER_ID
  });

  const cohort = await upsertCohort();
  await upsertCohortRule(cohort.id);
  const dataset = await upsertDataset();
  const datasetVersion = await upsertDatasetVersion(dataset.id, cohort.id);
  const statisticalPlan = await upsertStatisticalPlan();
  const analysisRun = await upsertAnalysisRun(datasetVersion.id, statisticalPlan.id);
  const analysisResult = await upsertAnalysisResult(analysisRun.id);
  await upsertResultArtifacts(analysisResult.id);
  const manuscript = await upsertManuscript();
  const manuscriptVersion = await upsertManuscriptVersion(manuscript.id);
  const resultsSection = await upsertManuscriptSections(manuscriptVersion.id);
  const aiJob = await upsertAiJob(manuscript.id, manuscriptVersion.id, resultsSection.id, datasetVersion.id, analysisRun.id);
  await upsertAiOutput(aiJob.id, datasetVersion.id, analysisRun.id, resultsSection.id);
  await upsertApproval();

  await prisma.auditLog.create({
    data: {
      tenantId: DEV_TENANT_ID,
      createdById: DEV_USER_ID,
      actorUserId: DEV_USER_ID,
      projectId: DEV_PROJECT_ID,
      resourceType: "SEED",
      resourceId: DEV_PROJECT_ID,
      action: "SEED_BOOTSTRAP",
      outcome: "SUCCESS",
      requestId: "seed-bootstrap",
      metadataJson: {
        executedAt: now.toISOString()
      }
    }
  }).catch(() => undefined);

  await prisma.accessLog.create({
    data: {
      tenantId: DEV_TENANT_ID,
      createdById: DEV_USER_ID,
      actorUserId: DEV_USER_ID,
      projectId: DEV_PROJECT_ID,
      resourceType: "SEED",
      resourceId: DEV_PROJECT_ID,
      action: "API_WRITE",
      outcome: "ALLOWED",
      requestId: "seed-bootstrap",
      metadataJson: {
        executedAt: now.toISOString()
      }
    }
  }).catch(() => undefined);

  console.log("");
  console.log("Seed complete.");
  console.log(`Tenant slug: aiorta-dev`);
  console.log(`Login email: ${DEV_USER_EMAIL}`);
  console.log(`Login password: ${DEV_PASSWORD}`);
  console.log(`Project slug: heart-failure-outcomes`);
}

async function seedRolePermissions(
  roleId: string,
  permissionKeys: string[],
  permissionRecords: Map<string, string>
): Promise<void> {
  for (const permissionKey of permissionKeys) {
    const permissionId = permissionRecords.get(permissionKey);

    if (!permissionId) {
      continue;
    }

    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId
        }
      },
      update: {
        deletedAt: null
      },
      create: {
        roleId,
        permissionId
      }
    });
  }
}

async function upsertTenantMembership(input: {
  tenantId: string;
  userId: string;
  roleId: string;
  createdById: string;
}): Promise<void> {
  const existing = await prisma.tenantMembership.findFirst({
    where: {
      tenantId: input.tenantId,
      userId: input.userId
    }
  });

  if (existing) {
    await prisma.tenantMembership.update({
      where: {
        id: existing.id
      },
      data: {
        roleId: input.roleId,
        status: "ACTIVE",
        joinedAt: new Date(),
        deletedAt: null
      }
    });
    return;
  }

  await prisma.tenantMembership.create({
    data: {
      tenantId: input.tenantId,
      createdById: input.createdById,
      userId: input.userId,
      roleId: input.roleId,
      status: "ACTIVE",
      joinedAt: new Date()
    }
  });
}

async function upsertProjectMember(input: {
  tenantId: string;
  projectId: string;
  userId: string;
  roleId: string;
  createdById: string;
}): Promise<void> {
  const existing = await prisma.projectMember.findFirst({
    where: {
      projectId: input.projectId,
      userId: input.userId
    }
  });

  if (existing) {
    await prisma.projectMember.update({
      where: {
        id: existing.id
      },
      data: {
        roleId: input.roleId,
        deletedAt: null
      }
    });
    return;
  }

  await prisma.projectMember.create({
    data: {
      tenantId: input.tenantId,
      createdById: input.createdById,
      projectId: input.projectId,
      userId: input.userId,
      roleId: input.roleId
    }
  });
}

async function upsertCohort() {
  const existing = await prisma.cohort.findFirst({
    where: {
      tenantId: DEV_TENANT_ID,
      projectId: DEV_PROJECT_ID,
      name: "Adults with Heart Failure",
      deletedAt: null
    }
  });

  if (existing) {
    return prisma.cohort.update({
      where: { id: existing.id },
      data: {
        description: "Development cohort for adult heart failure patients.",
        status: CohortStatus.DRAFT,
        deletedAt: null
      }
    });
  }

  return prisma.cohort.create({
    data: {
      id: DEV_COHORT_ID,
      tenantId: DEV_TENANT_ID,
      createdById: DEV_USER_ID,
      projectId: DEV_PROJECT_ID,
      name: "Adults with Heart Failure",
      description: "Development cohort for adult heart failure patients.",
      status: CohortStatus.DRAFT
    }
  });
}

async function upsertCohortRule(cohortId: string): Promise<void> {
  const existing = await prisma.cohortRule.findFirst({
    where: {
      cohortId,
      nodeType: CohortRuleNodeType.CONDITION,
      fieldKey: "age",
      deletedAt: null
    }
  });

  if (existing) {
    await prisma.cohortRule.update({
      where: { id: existing.id },
      data: {
        operator: ComparisonOperator.GTE,
        valueJson: { value: 18 },
        sortOrder: 0,
        deletedAt: null
      }
    });
    return;
  }

  await prisma.cohortRule.create({
    data: {
      id: DEV_COHORT_RULE_ID,
      tenantId: DEV_TENANT_ID,
      createdById: DEV_USER_ID,
      cohortId,
      nodeType: CohortRuleNodeType.CONDITION,
      logicalOperator: LogicalOperator.AND,
      fieldKey: "age",
      fieldLabel: "Age",
      operator: ComparisonOperator.GTE,
      valueJson: { value: 18 },
      sortOrder: 0
    }
  });
}

async function upsertDataset() {
  const existing = await prisma.dataset.findFirst({
    where: {
      tenantId: DEV_TENANT_ID,
      projectId: DEV_PROJECT_ID,
      name: "HF Analysis Dataset",
      deletedAt: null
    }
  });

  if (existing) {
    return prisma.dataset.update({
      where: { id: existing.id },
      data: {
        description: "Analysis-ready seed dataset.",
        status: DatasetStatus.ACTIVE,
        deletedAt: null
      }
    });
  }

  return prisma.dataset.create({
    data: {
      id: DEV_DATASET_ID,
      tenantId: DEV_TENANT_ID,
      createdById: DEV_USER_ID,
      projectId: DEV_PROJECT_ID,
      name: "HF Analysis Dataset",
      description: "Analysis-ready seed dataset.",
      status: DatasetStatus.ACTIVE
    }
  });
}

async function upsertDatasetVersion(datasetId: string, cohortId: string) {
  const existing = await prisma.datasetVersion.findFirst({
    where: {
      tenantId: DEV_TENANT_ID,
      projectId: DEV_PROJECT_ID,
      datasetId,
      versionNumber: 1,
      deletedAt: null
    }
  });

  if (existing) {
    return prisma.datasetVersion.update({
      where: { id: existing.id },
      data: {
        cohortId,
        status: DatasetVersionStatus.READY,
        rowCount: 128,
        columnCount: 12,
        contentChecksum: "seed-dataset-v1",
        deletedAt: null
      }
    });
  }

  return prisma.datasetVersion.create({
    data: {
      id: DEV_DATASET_VERSION_ID,
      tenantId: DEV_TENANT_ID,
      createdById: DEV_USER_ID,
      projectId: DEV_PROJECT_ID,
      datasetId,
      cohortId,
      versionNumber: 1,
      status: DatasetVersionStatus.READY,
      rowCount: 128,
      columnCount: 12,
      contentChecksum: "seed-dataset-v1"
    }
  });
}

async function upsertStatisticalPlan() {
  const existing = await prisma.statisticalPlan.findFirst({
    where: {
      tenantId: DEV_TENANT_ID,
      projectId: DEV_PROJECT_ID,
      name: "Primary Outcome Plan",
      version: 1,
      deletedAt: null
    }
  });

  if (existing) {
    return prisma.statisticalPlan.update({
      where: { id: existing.id },
      data: {
        status: StatisticalPlanStatus.APPROVED,
        planJson: {
          primaryEndpoint: "30-day mortality",
          model: "logistic_regression"
        },
        deletedAt: null
      }
    });
  }

  return prisma.statisticalPlan.create({
    data: {
      id: DEV_PLAN_ID,
      tenantId: DEV_TENANT_ID,
      createdById: DEV_USER_ID,
      projectId: DEV_PROJECT_ID,
      name: "Primary Outcome Plan",
      version: 1,
      status: StatisticalPlanStatus.APPROVED,
      planJson: {
        primaryEndpoint: "30-day mortality",
        model: "logistic_regression"
      }
    }
  });
}

async function upsertAnalysisRun(datasetVersionId: string, statisticalPlanId: string) {
  const existing = await prisma.analysisRun.findFirst({
    where: {
      tenantId: DEV_TENANT_ID,
      projectId: DEV_PROJECT_ID,
      datasetVersionId,
      deletedAt: null
    }
  });

  if (existing) {
    return prisma.analysisRun.update({
      where: { id: existing.id },
      data: {
        statisticalPlanId,
        status: AnalysisRunStatus.SUCCEEDED,
        startedAt: new Date(),
        completedAt: new Date(),
        deletedAt: null
      }
    });
  }

  return prisma.analysisRun.create({
    data: {
      id: DEV_ANALYSIS_RUN_ID,
      tenantId: DEV_TENANT_ID,
      createdById: DEV_USER_ID,
      projectId: DEV_PROJECT_ID,
      datasetVersionId,
      statisticalPlanId,
      status: AnalysisRunStatus.SUCCEEDED,
      startedAt: new Date(),
      completedAt: new Date()
    }
  });
}

async function upsertAnalysisResult(analysisRunId: string) {
  const existing = await prisma.analysisResult.findFirst({
    where: {
      tenantId: DEV_TENANT_ID,
      projectId: DEV_PROJECT_ID,
      analysisRunId,
      title: "Primary Outcome Summary",
      deletedAt: null
    }
  });

  if (existing) {
    return prisma.analysisResult.update({
      where: { id: existing.id },
      data: {
        resultType: AnalysisResultType.REGRESSION,
        status: ArtifactStatus.APPROVED,
        summaryJson: {
          mortalityRate: 0.14,
          adjustedOddsRatio: 1.82
        },
        deletedAt: null
      }
    });
  }

  return prisma.analysisResult.create({
    data: {
      id: DEV_ANALYSIS_RESULT_ID,
      tenantId: DEV_TENANT_ID,
      createdById: DEV_USER_ID,
      projectId: DEV_PROJECT_ID,
      analysisRunId,
      resultType: AnalysisResultType.REGRESSION,
      title: "Primary Outcome Summary",
      status: ArtifactStatus.APPROVED,
      summaryJson: {
        mortalityRate: 0.14,
        adjustedOddsRatio: 1.82
      }
    }
  });
}

async function upsertResultArtifacts(analysisResultId: string): Promise<void> {
  const table = await prisma.resultTable.findFirst({
    where: {
      analysisResultId,
      tableKey: "table-1",
      deletedAt: null
    }
  });

  if (!table) {
    await prisma.resultTable.create({
      data: {
        id: DEV_TABLE_ID,
        tenantId: DEV_TENANT_ID,
        createdById: DEV_USER_ID,
        projectId: DEV_PROJECT_ID,
        analysisResultId,
        tableKey: "table-1",
        title: "Baseline Characteristics",
        status: ArtifactStatus.APPROVED
      }
    });
  }

  const figure = await prisma.resultFigure.findFirst({
    where: {
      analysisResultId,
      figureKey: "figure-1",
      deletedAt: null
    }
  });

  if (!figure) {
    await prisma.resultFigure.create({
      data: {
        id: DEV_FIGURE_ID,
        tenantId: DEV_TENANT_ID,
        createdById: DEV_USER_ID,
        projectId: DEV_PROJECT_ID,
        analysisResultId,
        figureKey: "figure-1",
        title: "Primary Outcome Forest Plot",
        status: ArtifactStatus.APPROVED
      }
    });
  }
}

async function upsertManuscript() {
  const existing = await prisma.manuscript.findFirst({
    where: {
      tenantId: DEV_TENANT_ID,
      projectId: DEV_PROJECT_ID,
      title: "Heart Failure Outcomes Manuscript",
      deletedAt: null
    }
  });

  if (existing) {
    return prisma.manuscript.update({
      where: { id: existing.id },
      data: {
        deletedAt: null
      }
    });
  }

  return prisma.manuscript.create({
    data: {
      id: DEV_MANUSCRIPT_ID,
      tenantId: DEV_TENANT_ID,
      createdById: DEV_USER_ID,
      projectId: DEV_PROJECT_ID,
      title: "Heart Failure Outcomes Manuscript"
    }
  });
}

async function upsertManuscriptVersion(manuscriptId: string) {
  const existing = await prisma.manuscriptVersion.findFirst({
    where: {
      tenantId: DEV_TENANT_ID,
      manuscriptId,
      versionNumber: 1,
      deletedAt: null
    }
  });

  if (existing) {
    return prisma.manuscriptVersion.update({
      where: { id: existing.id },
      data: {
        outlineJson: {
          sections: ["Introduction", "Methods", "Results", "Discussion"]
        },
        deletedAt: null
      }
    });
  }

  return prisma.manuscriptVersion.create({
    data: {
      id: DEV_MANUSCRIPT_VERSION_ID,
      tenantId: DEV_TENANT_ID,
      createdById: DEV_USER_ID,
      manuscriptId,
      versionNumber: 1,
      changeSummary: "Initial seeded manuscript version.",
      outlineJson: {
        sections: ["Introduction", "Methods", "Results", "Discussion"]
      }
    }
  });
}

async function upsertManuscriptSections(manuscriptVersionId: string) {
  const sections = [
    {
      id: "8335c624-57fd-4f21-b6f5-3ec888e23db5",
      sectionType: ManuscriptSectionType.TITLE,
      title: "Title",
      content: "Heart Failure Outcomes in a Seeded Research Cohort"
    },
    {
      id: "6c676d16-3d88-4cca-ab48-070aa499ca4d",
      sectionType: ManuscriptSectionType.ABSTRACT,
      title: "Abstract",
      content: "Seed abstract content for frontend development."
    },
    {
      id: "5116a5db-414a-4d28-a640-2d28ea4a17cc",
      sectionType: ManuscriptSectionType.INTRODUCTION,
      title: "Introduction",
      content: "Seed introduction content."
    },
    {
      id: "47c77201-75ca-463f-a9b8-8516236fb8f7",
      sectionType: ManuscriptSectionType.METHODS,
      title: "Methods",
      content: "Seed methods content."
    },
    {
      id: DEV_RESULTS_SECTION_ID,
      sectionType: ManuscriptSectionType.RESULTS,
      title: "Results",
      content: "Seed results content."
    },
    {
      id: "2ec2f0c5-2fd8-403d-b7ce-13efde2f1efd",
      sectionType: ManuscriptSectionType.DISCUSSION,
      title: "Discussion",
      content: "Seed discussion content."
    },
    {
      id: "0e607775-4152-47bc-a16f-5449af658ed5",
      sectionType: ManuscriptSectionType.REFERENCES,
      title: "References",
      content: ""
    }
  ];

  for (const [index, section] of sections.entries()) {
    const existing = await prisma.manuscriptSection.findFirst({
      where: {
        manuscriptVersionId,
        sectionType: section.sectionType,
        deletedAt: null
      }
    });

    if (existing) {
      await prisma.manuscriptSection.update({
        where: { id: existing.id },
        data: {
          title: section.title,
          content: section.content,
          sortOrder: index,
          deletedAt: null
        }
      });
      continue;
    }

    await prisma.manuscriptSection.create({
      data: {
        id: section.id,
        tenantId: DEV_TENANT_ID,
        createdById: DEV_USER_ID,
        manuscriptVersionId,
        sectionType: section.sectionType,
        title: section.title,
        content: section.content,
        sortOrder: index
      }
    });
  }

  return prisma.manuscriptSection.findUniqueOrThrow({
    where: { id: DEV_RESULTS_SECTION_ID }
  });
}

async function upsertAiJob(
  manuscriptId: string,
  manuscriptVersionId: string,
  manuscriptSectionId: string,
  datasetVersionId: string,
  analysisRunId: string
) {
  const existing = await prisma.aIJob.findFirst({
    where: {
      tenantId: DEV_TENANT_ID,
      projectId: DEV_PROJECT_ID,
      manuscriptSectionId,
      deletedAt: null
    }
  });

  if (existing) {
    return prisma.aIJob.update({
      where: { id: existing.id },
      data: {
        jobType: AIJobType.RESULTS_DRAFT,
        status: AIJobStatus.COMPLETED,
        inputBundleJson: {
          source: "seed"
        },
        deletedAt: null
      }
    });
  }

  return prisma.aIJob.create({
    data: {
      id: DEV_AI_JOB_ID,
      tenantId: DEV_TENANT_ID,
      createdById: DEV_USER_ID,
      projectId: DEV_PROJECT_ID,
      manuscriptId,
      manuscriptVersionId,
      manuscriptSectionId,
      datasetVersionId,
      analysisRunId,
      jobType: AIJobType.RESULTS_DRAFT,
      status: AIJobStatus.COMPLETED,
      inputBundleJson: {
        source: "seed"
      }
    }
  });
}

async function upsertAiOutput(
  aiJobId: string,
  datasetVersionId: string,
  analysisRunId: string,
  manuscriptSectionId: string
) {
  const existing = await prisma.aIOutput.findFirst({
    where: {
      tenantId: DEV_TENANT_ID,
      projectId: DEV_PROJECT_ID,
      aiJobId,
      deletedAt: null
    }
  });

  if (existing) {
    const updated = await prisma.aIOutput.update({
      where: { id: existing.id },
      data: {
        outputText:
          "The seeded cohort included 128 adults with heart failure, with an estimated 30-day mortality of 14%.",
        status: AIOutputStatus.READY_FOR_REVIEW,
        deletedAt: null
      }
    });

    await upsertAiReview(updated.id);
    return updated;
  }

  const output = await prisma.aIOutput.create({
    data: {
      id: DEV_AI_OUTPUT_ID,
      tenantId: DEV_TENANT_ID,
      createdById: DEV_USER_ID,
      aiJobId,
      projectId: DEV_PROJECT_ID,
      datasetVersionId,
      analysisRunId,
      manuscriptSectionId,
      outputText:
        "The seeded cohort included 128 adults with heart failure, with an estimated 30-day mortality of 14%.",
      status: AIOutputStatus.READY_FOR_REVIEW
    }
  });

  await upsertAiReview(output.id);
  return output;
}

async function upsertAiReview(aiOutputId: string): Promise<void> {
  const existing = await prisma.aIReview.findFirst({
    where: {
      tenantId: DEV_TENANT_ID,
      aiOutputId,
      reviewerId: DEV_USER_ID,
      deletedAt: null
    }
  });

  if (existing) {
    await prisma.aIReview.update({
      where: { id: existing.id },
      data: {
        decision: AIReviewDecision.NEEDS_CHANGES,
        comments: "Seed review requesting light edits.",
        deletedAt: null
      }
    });
    return;
  }

  await prisma.aIReview.create({
    data: {
      id: DEV_AI_REVIEW_ID,
      tenantId: DEV_TENANT_ID,
      createdById: DEV_USER_ID,
      aiOutputId,
      reviewerId: DEV_USER_ID,
      decision: AIReviewDecision.NEEDS_CHANGES,
      comments: "Seed review requesting light edits."
    }
  });
}

async function upsertApproval(): Promise<void> {
  const existing = await prisma.approval.findFirst({
    where: {
      tenantId: DEV_TENANT_ID,
      projectId: DEV_PROJECT_ID,
      targetId: DEV_DATASET_VERSION_ID,
      deletedAt: null
    }
  });

  if (existing) {
    await prisma.approval.update({
      where: { id: existing.id },
      data: {
        targetType: ApprovalTargetType.DATASET_VERSION,
        status: ApprovalStatus.PENDING,
        notes: "Seed approval for dataset version.",
        deletedAt: null
      }
    });
    return;
  }

  await prisma.approval.create({
    data: {
      id: DEV_APPROVAL_ID,
      tenantId: DEV_TENANT_ID,
      createdById: DEV_USER_ID,
      projectId: DEV_PROJECT_ID,
      targetType: ApprovalTargetType.DATASET_VERSION,
      targetId: DEV_DATASET_VERSION_ID,
      status: ApprovalStatus.PENDING,
      requestedById: DEV_USER_ID,
      notes: "Seed approval for dataset version."
    }
  });
}

void main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
