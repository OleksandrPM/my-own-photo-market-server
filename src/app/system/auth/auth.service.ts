import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { verifyPassword } from '../../common/utils/password.utils';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenManagerService } from '../tokens/tokens-manager.service';
import { ProfilesService } from 'src/app/product/profiles/profiles.service';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';
import { EmailManagerService } from '../communications/email/email-manager.service';
import { ProfileResponseDto } from 'src/app/product/profiles/dto/profile-response.dto';
import { AvatarStorageService } from 'src/app/infrastructure/storage/image-storage/avatar-storage.service';
import { UsersRepository } from 'src/app/infrastructure/data/database/users/users.repository';
import { AuthResult, RefreshResult } from './auth.types';
import { Warning, WarningCode, warningService } from 'src/app/common/warning';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly warnings = warningService;

  constructor(
    private readonly profilesService: ProfilesService,
    private readonly usersRepository: UsersRepository,
    private readonly tokenService: TokenManagerService,
    private readonly emailService: EmailManagerService,
    private readonly avatarStorageService: AvatarStorageService,
  ) {}

  private async issueAuthResult(
    user: UserEntity,
    warning?: Warning,
  ): Promise<AuthResult> {
    let avatarUrl: string | null = null;

    if (user.avatarKey) {
      try {
        avatarUrl = await this.avatarStorageService.getAvatarUrl(
          user.avatarKey,
        );
      } catch (e) {
        this.logger.warn(
          `Avatar URL resolve failed`,
          JSON.stringify({ userId: user.id, avatarKey: user.avatarKey }),
          e instanceof Error ? e.stack : undefined,
        );

        warning ??= this.warnings.create(WarningCode.AVATAR_URL_RESOLVE_FAILED);
      }
    }

    const userResponse = ProfileResponseDto.fromDomain(user, avatarUrl);
    const accessToken = this.tokenService.generateAccessToken(user);
    const deviceId = randomUUID();
    const { rawToken } = await this.tokenService.createRefreshToken(
      user,
      deviceId,
    );

    return {
      user: userResponse,
      accessToken,
      refreshToken: rawToken,
      deviceId,
      ...(warning ? { warning } : {}),
    };
  }

  async signUp(
    dto: RegisterDto,
    avatar?: Express.Multer.File,
  ): Promise<AuthResult> {
    const user = await this.profilesService.createUserProfile(dto, avatar);

    if (!user) {
      throw new InternalServerErrorException('User creation failed');
    }

    const confirmationToken =
      await this.tokenService.createEmailConfirmationToken(user);

    let warning: Warning | undefined;

    // Send confirmation email
    try {
      await this.emailService.sendConfirmationEmail(
        user,
        confirmationToken.rawToken,
        confirmationToken.expiresAt,
      );
    } catch (e) {
      this.logger.warn(
        `Confirmation email not sent for userId=${user.id}, email=${user.email}`,
        JSON.stringify({ userId: user.id, email: user.email }),
        e instanceof Error ? e.stack : undefined,
      );

      warning = this.warnings.create(WarningCode.EMAIL_NOT_SENT);
    }

    return this.issueAuthResult(user, warning);
  }

  async signIn({ email, password }: LoginDto): Promise<AuthResult> {
    const userOrm =
      await this.usersRepository.findByEmailWithPasswordHash(email);

    if (!userOrm) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await verifyPassword(
      userOrm.passwordHash,
      password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = UserEntity.from(userOrm);

    return this.issueAuthResult(user);
  }

  async logout(refreshToken: string, deviceId: string): Promise<void> {
    try {
      const tokenRecord = await this.tokenService.validateRefreshToken(
        refreshToken,
        deviceId,
      );

      await this.tokenService.revokeToken(tokenRecord.id);
    } catch {
      // ignore — logout must always succeed
    }
  }

  async verifyEmail(token: string): Promise<UserEntity> {
    const tokenRecord =
      await this.tokenService.validateEmailConfirmationToken(token);

    await this.tokenService.revokeToken(tokenRecord.id);

    if (!tokenRecord.userId) {
      throw new UnauthorizedException('Invalid email confirmation token');
    }

    const user = await this.profilesService.findById(tokenRecord.userId);

    if (!user) {
      throw new UnauthorizedException('Invalid email confirmation token');
    }

    if (!user.isVerified) {
      return this.profilesService.markEmailVerified(user.id);
    }

    return user;
  }

  async refresh(
    refreshToken: string,
    deviceId: string,
  ): Promise<RefreshResult> {
    const tokenRecord = await this.tokenService.validateRefreshToken(
      refreshToken,
      deviceId,
    );

    if (!tokenRecord.userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.profilesService.findById(tokenRecord.userId);

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Issue new tokens
    const accessToken = this.tokenService.generateAccessToken(user);
    const { rawToken: newRefreshToken } =
      await this.tokenService.createRefreshToken(user, deviceId);

    // Revoke old refresh token
    await this.tokenService.revokeToken(tokenRecord.id);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async getMe(userId: UserEntity['id']): Promise<ProfileResponseDto> {
    const user = await this.profilesService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    let avatarUrl: string | null = null;

    if (user.avatarKey) {
      try {
        avatarUrl = await this.avatarStorageService.getAvatarUrl(
          user.avatarKey,
        );
      } catch (e) {
        this.logger.warn(
          `Avatar URL resolve failed`,
          JSON.stringify({ userId: user.id, avatarKey: user.avatarKey }),
          e instanceof Error ? e.stack : undefined,
        );
      }
    }

    return ProfileResponseDto.fromDomain(user, avatarUrl);
  }
}
