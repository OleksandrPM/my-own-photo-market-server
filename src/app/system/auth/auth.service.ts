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
    const { rawToken } = await this.tokenService.createRefreshToken(
      user,
      deviceId,
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
    };
  }

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

  async verifyEmail(token: string): Promise<VerifyEmailResponseDto> {
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
      const updatedUser = await this.profilesService.markEmailVerified(user.id);
      const { dto, warnings } =
        await this.profilePresenter.toDtoWithWarnings(updatedUser);

      return { user: dto, warnings };
    }

    const { dto, warnings } =
      await this.profilePresenter.toDtoWithWarnings(user);
    return { user: dto, warnings };
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
