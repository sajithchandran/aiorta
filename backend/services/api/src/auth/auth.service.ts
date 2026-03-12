import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { PlatformRole } from "../common/enums/platform-role.enum";
import { AppConfigService } from "../config/app-config.service";
import { PrismaService } from "../prisma/prisma.service";
import { AuthTokenResponseDto } from "./dto/auth-token-response.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
    private readonly prisma: PrismaService
  ) {}

  async login(payload: LoginDto): Promise<AuthTokenResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.email
      }
    });

    if (!user || user.deletedAt || !user.isActive || !user.passwordHash) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const passwordMatches = await compare(payload.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    return this.signAccessToken({
      userId: user.id,
      email: user.email,
      platformRole: PlatformRole.USER
    });
  }

  signAccessToken(subject: {
    userId: string;
    email: string;
    platformRole: PlatformRole;
  }): AuthTokenResponseDto {
    return {
      accessToken: this.jwtService.sign(subject),
      expiresIn: this.configService.jwtExpiresIn
    };
  }
}
