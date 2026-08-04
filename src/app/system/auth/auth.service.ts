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
import { AvatarStorageService } from 'src/app/infrastructure/storage/image-storage/avatar-storage.service';
import { UsersRepository } from 'src/app/infrastructure/data/database/users/users.repository';
import { AuthResult, RefreshResult } from './auth.types';
import { WarningCode, warningService } from 'src/app/common/warning';
import { ProfilePresenter } from 'src/app/product/profiles/profiles.presenter';
import { WarningCollector } from 'src/app/common/warning/warning.collector';
import { VerifyEmailResponseDto } from './dto/verify-email-response.dto';
import { MeResponseDto } from './dto/me-response.dto';
import { decodeToken } from '../tokens/tokens.utils';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly warnings = warningService;

  constructor(
    private readonly profilesService: ProfilesService,
    private readonly profilePresenter: ProfilePresenter,
    private readonly usersRepository: UsersRepository,
    private readonly tokenService: TokenManagerService,
    private readonly emailService: EmailManagerService,
    private readonly avatarStorageService: AvatarStorageService,
  ) {}

  private async issueAuthResult(
    user: UserEntity,
    warningCollector: WarningCollector = new WarningCollector(),
  ): Promise<AuthResult> {
    const { dto: userProfile, warnings: userWarnings } =
      await this.profilePresenter.toDtoWithWarnings(user);

    const accessToken = this.tokenService.generateAccessToken(user);
    const deviceId = randomUUID();
    const sessionId = randomUUID();
    const { rawToken } = await this.tokenService.createRefreshToken(
      user,
      deviceId,
      sessionId,
    );

    for (const warning of userWarnings ?? []) {
      warningCollector.add(warning);
    }

    return {
      response: {
        user: userProfile,
        accessToken,
        ...(warningCollector.hasAny()
          ? { warnings: warningCollector.getAll() }
          : {}),
      },
      refreshToken: rawToken,
      deviceId,
      sessionId,
    };
  }

  // getCsrfToken(): string {
  //   return this.tokenService.generateCsrfToken();
  // }

  async signUp(
    dto: RegisterDto,
    avatar?: Express.Multer.File,
  ): Promise<AuthResult> {
    const warningCollector = new WarningCollector();
    const user = await this.profilesService.createUserProfile(dto, avatar);

    if (!user) {
      throw new InternalServerErrorException('User creation failed');
    }

    const confirmationToken =
      await this.tokenService.createEmailConfirmationToken(user);

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

      warningCollector.add(this.warnings.create(WarningCode.EMAIL_NOT_SENT));
    }

    return this.issueAuthResult(user, warningCollector);
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

  async logout(
    userId: number,
    encodedRefreshToken: string,
    deviceId: string,
    sessionId: string,
  ): Promise<void> {
    const user = await this.profilesService.findById(userId);

    if (!user) {
      return;
    }

    const { tokenId, rawToken } = decodeToken(encodedRefreshToken);

    try {
      const tokenRecord = await this.tokenService.validateRefreshToken(
        tokenId,
        rawToken,
        deviceId,
        sessionId,
      );

      await this.tokenService.revokeTokenById(tokenRecord.id);
    } catch {
      // ignore — logout must always succeed
    }
  }

  async verifyEmail(
    tokenId: number,
    token: string,
  ): Promise<VerifyEmailResponseDto> {
    const tokenRecord = await this.tokenService.validateEmailConfirmationToken(
      tokenId,
      token,
    );

    if (!tokenRecord.userId) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.profilesService.findById(tokenRecord.userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // already verified → idempotent return
    if (user.isVerified) {
      await this.tokenService.revokeTokenById(tokenRecord.id).catch(() => {});
      const { dto, warnings } =
        await this.profilePresenter.toDtoWithWarnings(user);

      return { user: dto, warnings };
    }

    // verify email and update profile
    const updatedUser = await this.profilesService.markEmailVerified(user.id);

    // revoke token after successful verification
    await this.tokenService.revokeTokenById(tokenRecord.id);

    const { dto, warnings } =
      await this.profilePresenter.toDtoWithWarnings(updatedUser);

    return { user: dto, warnings };
  }

  async refresh(
    encodedRefreshToken: string,
    deviceId: string,
    sessionId: string,
  ): Promise<RefreshResult> {
    const { tokenId, rawToken } = decodeToken(encodedRefreshToken);

    const tokenRecord = await this.tokenService.validateRefreshToken(
      tokenId,
      rawToken,
      deviceId,
      sessionId,
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
      await this.tokenService.createRefreshToken(user, deviceId, sessionId);

    // Revoke old refresh token
    await this.tokenService.revokeTokenById(tokenRecord.id);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async getMe(userId: UserEntity['id']): Promise<MeResponseDto> {
    const user = await this.profilesService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const { dto, warnings } =
      await this.profilePresenter.toDtoWithWarnings(user);

    return { user: dto, warnings };
  }
}
