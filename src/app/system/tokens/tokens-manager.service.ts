import { Injectable } from '@nestjs/common';
import { RefreshTokenService } from './handlers/refresh-token.service';
import { EmailConfirmTokenService } from './handlers/email-confirm-token.service';
import { EmailChangeTokenService } from './handlers/email-change-token.service';
import { TokenService } from './tokens.service';
import { UserEntity } from '../../product/profiles/entities/user.entity';
import { SetupTokenService } from './handlers/setup-token.service';
import { PasswordResetTokenService } from './handlers/password-reset-token.service';
import { TwoFactorAuthTokenService } from './handlers/two-factor-token.service';

@Injectable()
export class TokenManagerService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly setupTokenService: SetupTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly emailConfirmTokenService: EmailConfirmTokenService,
    private readonly emailChangeTokenService: EmailChangeTokenService,
    private readonly passwordResetTokenService: PasswordResetTokenService,
    private readonly twoFactorAuthTokenService: TwoFactorAuthTokenService,
  ) {}

  // Common token management methods
  async revokeToken(id: number) {
    return this.tokenService.revokeToken(id);
  }

  generateAccessToken(user: UserEntity): string {
    return this.tokenService.generateAccessToken(user);
  }

  // Setup token methods
  async createSetupToken(ownerEmail: string, deviceId: string) {
    return this.setupTokenService.createSetupToken(ownerEmail, deviceId);
  }

  async validateSetupToken(token: string) {
    return this.setupTokenService.validateSetupToken(token);
  }

  async confirmOwnerEmail(tokenId: number) {
    return this.setupTokenService.confirmOwnerEmail(tokenId);
  }

  async isOwnerEmailConfirmed(email: string, deviceId: string) {
    return this.setupTokenService.isOwnerEmailConfirmed(email, deviceId);
  }

  // Refresh token methods
  async createRefreshToken(user: UserEntity, deviceId?: string) {
    return this.refreshTokenService.createRefreshToken(user, deviceId);
  }

  async validateRefreshToken(token: string, deviceId: string) {
    return this.refreshTokenService.validateRefreshToken(token, deviceId);
  }

  // Email confirmation token methods
  async createEmailConfirmationToken(user: UserEntity) {
    return this.emailConfirmTokenService.createEmailConfirmationToken(user);
  }

  async validateEmailConfirmationToken(token: string) {
    return this.emailConfirmTokenService.validateEmailConfirmationToken(token);
  }

  // Email change token methods
  async createEmailChangeToken(user: UserEntity, newEmail: string) {
    return this.emailChangeTokenService.createEmailChangeToken(user, newEmail);
  }

  async validateEmailChangeToken(token: string) {
    return this.emailChangeTokenService.validateEmailChangeToken(token);
  }

  // Password reset token methods
  async createPasswordResetToken(user: UserEntity) {
    return this.passwordResetTokenService.createPasswordResetToken(user);
  }

  async validatePasswordResetToken(token: string) {
    return this.passwordResetTokenService.validatePasswordResetToken(token);
  }

  // Two-factor auth token methods
  async createTwoFaToken(user: UserEntity) {
    return this.twoFactorAuthTokenService.createTwoFaToken(user);
  }

  async validateTwoFaToken(token: string) {
    return this.twoFactorAuthTokenService.validateTwoFaToken(token);
  }
}
