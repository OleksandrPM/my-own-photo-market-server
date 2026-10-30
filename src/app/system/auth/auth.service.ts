import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyPassword } from '../../common/utils/password.utils';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenManagerService } from '../token/token-manager.service';
import { ProfilesService } from 'src/app/product/profile/profile.service';
import { ProfileEntity } from 'src/app/product/profile/entities/profile.entity';
import { EmailManagerService } from '../communication/email/email-manager.service';
import { ProfilesRepository } from 'src/app/infrastructure/data/database/profiles/profiles.repository';
import { AuthResult, RefreshResult } from './auth.types';
import { WarningCode, warningService } from 'src/app/common/warning';
import { ProfilePresenter } from 'src/app/product/profile/profile.presenter';
import { WarningCollector } from 'src/app/common/warning/warning.collector';
import { VerifyEmailResponseDto } from './dto/verify-email-response.dto';
import { MeResponseDto } from './dto/me-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly warnings = warningService;

  constructor(
    private readonly profilesService: ProfilesService,
    private readonly profilePresenter: ProfilePresenter,
    private readonly profilesRepository: ProfilesRepository,
    private readonly tokenService: TokenManagerService,
    private readonly emailService: EmailManagerService,
  ) {}

  private async issueAuthResult(
    user: ProfileEntity,
    deviceId: string,
    warningCollector: WarningCollector = new WarningCollector(),
  ): Promise<AuthResult> {
    const userProfile = await this.profilePresenter.toDto(user);

    const accessToken = this.tokenService.generateAccessToken(user.id);

    const { encodedToken: refreshToken } =
      await this.tokenService.createRefreshToken(user.id, deviceId);

    return {
      response: {
        user: userProfile,
        accessToken,
        ...(warningCollector.hasAny()
          ? { warnings: warningCollector.getAll() }
          : {}),
      },
      refreshToken,
    };
  }

  async signUp(
    dto: RegisterDto,
    deviceId: string,
    avatar?: Express.Multer.File,
  ): Promise<AuthResult> {
    const warningCollector = new WarningCollector();
    const user = await this.profilesService.createUserProfile(dto, avatar);

    if (!user) {
      throw new InternalServerErrorException('User creation failed');
    }

    const { encodedToken: confirmationToken, tokenRecord } =
      await this.tokenService.createEmailConfirmationToken(user.id);

    // Send confirmation email
    try {
      await this.emailService.sendConfirmationEmail(
        user,
        confirmationToken,
        tokenRecord.expiresAt,
      );
    } catch (e) {
      this.logger.warn(
        `Confirmation email not sent for userId=${user.id}, email=${user.email}`,
        JSON.stringify({ userId: user.id, email: user.email }),
        e instanceof Error ? e.stack : undefined,
      );

      warningCollector.add(this.warnings.create(WarningCode.EMAIL_NOT_SENT));
    }

    return this.issueAuthResult(user, deviceId, warningCollector);
  }

  async signIn(
    { email, password }: LoginDto,
    deviceId: string,
  ): Promise<AuthResult> {
    const userOrm =
      await this.profilesRepository.findByEmailWithPasswordHash(email);

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

    const user = ProfileEntity.from(userOrm);

    return this.issueAuthResult(user, deviceId);
  }

  async verifyEmail(token: string): Promise<VerifyEmailResponseDto> {
    const tokenRecord =
      await this.tokenService.validateEmailConfirmationToken(token);

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

      const profile = await this.profilePresenter.toDto(user);

      return { profile };
    }

    // verify email and update profile
    const updatedUser = await this.profilesService.markEmailVerified(user.id);

    // revoke token after successful verification
    await this.tokenService.revokeTokenById(tokenRecord.id);

    const profile = await this.profilePresenter.toDto(updatedUser);

    return { profile };
  }

  async refresh(
    refreshToken: string,
    deviceId: string,
  ): Promise<RefreshResult> {
    const tokenRecord = await this.tokenService.validateRefreshToken(
      refreshToken,
      deviceId,
    );

    const user = await this.profilesService.findById(tokenRecord.userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Issue new tokens
    const accessToken = this.tokenService.generateAccessToken(user.id);
    const { encodedToken: newRefreshToken } =
      await this.tokenService.createRefreshToken(user.id, deviceId);

    // Revoke old refresh token
    await this.tokenService.revokeTokenById(tokenRecord.id);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async getMe(userId: ProfileEntity['id']): Promise<MeResponseDto> {
    const user = await this.profilesService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const profile = await this.profilePresenter.toDto(user);

    return { profile };
  }

  async logout(refreshToken: string, deviceId: string): Promise<void> {
    try {
      const tokenRecord = await this.tokenService.validateRefreshToken(
        refreshToken,
        deviceId,
      );

      await this.tokenService.revokeTokenById(tokenRecord.id);
    } catch {
      // logout must always succeed
    }
  }
}
