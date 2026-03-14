import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { MembershipStatus, Prisma, User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { QueryUsersDto } from "./dto/query-users.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentUser(userId: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null
      }
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} was not found.`);
    }

    return user;
  }

  async updateCurrentUser(userId: string, payload: UpdateUserDto): Promise<User> {
    await this.getCurrentUser(userId);

    return this.prisma.user.update({
      where: {
        id: userId
      },
      data: payload
    });
  }

  async createTenantUser(
    tenantId: string,
    actorUserId: string,
    payload: CreateUserDto
  ): Promise<User> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const role = await tx.role.findFirst({
          where: {
            id: payload.roleId,
            deletedAt: null
          },
          select: {
            id: true
          }
        });

        if (!role) {
          throw new NotFoundException(`Role ${payload.roleId} was not found.`);
        }

        const existingUser = await tx.user.findUnique({
          where: {
            email: payload.email
          }
        });

        const user = existingUser
          ? await tx.user.update({
              where: { id: existingUser.id },
              data: {
                fullName: payload.fullName,
                isActive: true,
                deletedAt: null
              }
            })
          : await tx.user.create({
              data: {
                tenantId,
                createdById: actorUserId,
                email: payload.email,
                fullName: payload.fullName,
                isActive: true
              }
            });

        const membership = await tx.tenantMembership.findFirst({
          where: {
            tenantId,
            userId: user.id
          },
          select: {
            id: true
          }
        });

        if (membership) {
          await tx.tenantMembership.update({
            where: { id: membership.id },
            data: {
              roleId: payload.roleId,
              status: MembershipStatus.ACTIVE,
              joinedAt: new Date(),
              deletedAt: null
            }
          });
        } else {
          await tx.tenantMembership.create({
            data: {
              tenantId,
              createdById: actorUserId,
              userId: user.id,
              roleId: payload.roleId,
              status: MembershipStatus.ACTIVE,
              joinedAt: new Date()
            }
          });
        }

        return user;
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException(`A user with email ${payload.email} already exists.`);
      }

      throw error;
    }
  }

  async listTenantUsers(tenantId: string, query: QueryUsersDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const where = this.buildTenantUserWhere(tenantId, query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        include: {
          memberships: {
            where: {
              tenantId,
              deletedAt: null
            },
            include: {
              role: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        skip,
        take: pageSize
      }),
      this.prisma.user.count({ where })
    ]);

    return { success: true, items, page, pageSize, total };
  }

  async getTenantUserById(tenantId: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
        memberships: {
          some: {
            tenantId,
            deletedAt: null
          }
        }
      },
      include: {
        memberships: {
          where: {
            tenantId,
            deletedAt: null
          },
          include: {
            role: true
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} was not found in tenant ${tenantId}.`);
    }

    return user;
  }

  async updateTenantUser(tenantId: string, userId: string, payload: UpdateUserDto): Promise<User> {
    await this.getTenantUserById(tenantId, userId);

    return this.prisma.user.update({
      where: {
        id: userId
      },
      data: payload
    });
  }

  private buildTenantUserWhere(
    tenantId: string,
    query: QueryUsersDto
  ): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      memberships: {
        some: {
          tenantId,
          deletedAt: null
        }
      }
    };

    if (typeof query.isActive === "boolean") {
      where.isActive = query.isActive;
    }

    if (query.search) {
      where.OR = [
        {
          email: {
            contains: query.search,
            mode: "insensitive"
          }
        },
        {
          fullName: {
            contains: query.search,
            mode: "insensitive"
          }
        }
      ];
    }

    return where;
  }
}
