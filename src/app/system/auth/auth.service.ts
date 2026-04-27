import { Injectable, UnauthorizedException } from '@nestjs/common';
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

@Injectable()
export class AuthService {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly usersRepository: UsersRepository,
    private readonly tokenService: TokenManagerService,
    private readonly emailService: EmailManagerService,
    private readonly avatarStorageService: AvatarStorageService,
  ) {}

  async signUp(
    dto: RegisterDto,
    avatar?: Express.Multer.File,
  ): Promise<{
    user: ProfileResponseDto;
    accessToken: string;
    refreshToken: string;
    deviceId: string;
  }> {
    const user = await this.profilesService.createUserProfile(dto, avatar);

    if (!user) {
      throw new Error('User creation failed');
    }

    const confirmationToken =
      await this.tokenService.createEmailConfirmationToken(user);

    // Send confirmation email
    await this.emailService.sendConfirmationEmail(
      user,
      confirmationToken.rawToken,
      confirmationToken.expiresAt,
    );

    const accessToken = this.tokenService.generateAccessToken(user);
    // Temporary deviceId (not persisted)
    const deviceId = randomUUID();
    const { rawToken } = await this.tokenService.createRefreshToken(
      user,
      deviceId,
    );

    const avatarUrl = user.avatarKey
      ? await this.avatarStorageService.getAvatarUrl(user.avatarKey)
      : null;

    const userResponse: ProfileResponseDto = ProfileResponseDto.fromDomain(
      user,
      avatarUrl,
    );

    return {
      user: userResponse,
      accessToken,
      refreshToken: rawToken,
      deviceId,
    };
  }

  async signIn({ email, password }: LoginDto) {
    const userOrm =
      await this.usersRepository.findByEmailWithPasswordHash(email);

    if (!userOrm) {
      throw new UnauthorizedException(`User with email ${email} not found`);
    }

    const isPasswordValid = await verifyPassword(
      userOrm.passwordHash,
      password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    const user = UserEntity.from(userOrm);
    const avatarUrl = user.avatarKey
      ? await this.avatarStorageService.getAvatarUrl(user.avatarKey)
      : null;

    const userResponse: ProfileResponseDto = ProfileResponseDto.fromDomain(
      user,
      avatarUrl,
    );

    const accessToken = this.tokenService.generateAccessToken(user);
    // Temporary deviceId (not persisted)
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
    };
  }

  async logout(refreshToken: string, deviceId: string) {
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

  async verifyEmail(token: string) {
    const tokenRecord =
      await this.tokenService.validateEmailConfirmationToken(token);

    await this.tokenService.revokeToken(tokenRecord.id);

    if (tokenRecord.userId) {
      const user = await this.profilesService.findById(tokenRecord.userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!user.isVerified) {
        return this.profilesService.markEmailVerified(user.id);
      }

      return user;
    }
  }

  async refresh(refreshToken: string, deviceId: string) {
    const tokenRecord = await this.tokenService.validateRefreshToken(
      refreshToken,
      deviceId,
    );

    if (!tokenRecord.userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.profilesService.findById(tokenRecord.userId!);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Issue new tokens
    const accessToken = this.tokenService.generateAccessToken(user);
    const { rawToken } = await this.tokenService.createRefreshToken(
      user,
      deviceId,
    );

    // Revoke old refresh token
    await this.tokenService.revokeToken(tokenRecord.id);

    return { accessToken, refreshToken: rawToken };
  }

  async getMe(userId: UserEntity['id']) {
    const user = await this.profilesService.findById(userId);

    if (!user) {
      throw new UnauthorizedException(`User with id ${userId} not found`);
    }

    const avatarUrl = user.avatarKey
      ? await this.avatarStorageService.getAvatarUrl(user.avatarKey)
      : null;

    const userResponse: ProfileResponseDto = ProfileResponseDto.fromDomain(
      user,
      avatarUrl,
    );

    const accessToken = this.tokenService.generateAccessToken(user);
    const refreshToken = await this.tokenService.createRefreshToken(user);

    return { user: userResponse, accessToken, refreshToken };
  }
}
