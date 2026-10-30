import { Injectable } from '@nestjs/common';
import { RefreshTokenService } from './handlers/refresh-token.service';
import { EmailConfirmTokenService } from './handlers/email-confirm-token.service';
import { EmailChangeTokenService } from './handlers/email-change-token.service';
import { TokenService } from './tokens.service';
import { ProfileEntity } from '../../product/profile/entities/profile.entity';
import { SetupTokenService } from './handlers/setup-token.service';
import { PasswordResetTokenService } from './handlers/password-reset-token.service';
import { TwoFactorAuthTokenService } from './handlers/two-factor-token.service';
import { AccessTokenService } from './handlers/access-token.service';
import { CsrfTokenService } from './handlers/csrf-token.service';
import { PersistentTokenType } from './tokens.types';

@Injectable()
export class TokenManagerService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly csrfTokenService: CsrfTokenService,
    private readonly accessTokenService: AccessTokenService,
    private readonly setupTokenService: SetupTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly emailConfirmTokenService: EmailConfirmTokenService,
    private readonly emailChangeTokenService: EmailChangeTokenService,
    private readonly passwordResetTokenService: PasswordResetTokenService,
    private readonly twoFactorAuthTokenService: TwoFactorAuthTokenService,
  ) {}

  // Common token management methods
  async revokeTokenById(id: number) {
    return this.tokenService.revokeTokenById(id);
  }

  async revokeTokensByType(tokenType: PersistentTokenType, date = new Date()) {
    return this.tokenService.revokeTokensByType(tokenType, date);
  }

  // CSRF token methods
  generateCsrfToken(deviceId: string): string {
    return this.csrfTokenService.generateCsrfToken(deviceId);
  }

  validateCsrfToken(token: string, deviceId: string): boolean {
    return this.csrfTokenService.validateCsrfToken(token, deviceId);
  }

  // Access token methods
  generateAccessToken(userId: ProfileEntity['id']): string {
    return this.accessTokenService.generateAccessToken(userId);
  }

  // Setup token methods
  async createSetupToken(ownerEmail: string, deviceId: string) {
    return this.setupTokenService.createSetupToken(ownerEmail, deviceId);
  }

  async getSetupTokenBySessionId(sessionId: string) {
    return this.setupTokenService.getSetupTokenBySessionId(sessionId);
  }

  async validateSetupToken(encodedToken: string, sessionId: string) {
    return this.setupTokenService.validateSetupToken(encodedToken, sessionId);
  }

  async validateSetupTokenFromEmail(encodedToken: string) {
    return this.setupTokenService.validateSetupTokenFromEmail(encodedToken);
  }

  async confirmOwnerEmail(tokenId: number) {
    return this.setupTokenService.confirmOwnerEmail(tokenId);
  }

  async isOwnerEmailConfirmed(sessionId: string) {
    return this.setupTokenService.isOwnerEmailConfirmed(sessionId);
  }

  // Refresh token methods
  async createRefreshToken(userId: ProfileEntity['id'], deviceId: string) {
    return this.refreshTokenService.createRefreshToken(userId, deviceId);
  }

  async validateRefreshToken(encodedToken: string, deviceId: string) {
    return this.refreshTokenService.validateRefreshToken(
      encodedToken,
      deviceId,
    );
  }

  // Email confirmation token methods
  async createEmailConfirmationToken(userId: ProfileEntity['id']) {
    return this.emailConfirmTokenService.createEmailConfirmationToken(userId);
  }

  async validateEmailConfirmationToken(token: string) {
    return this.emailConfirmTokenService.validateEmailConfirmationToken(token);
  }

  // Email change token methods
  async createEmailChangeToken(userId: ProfileEntity['id'], newEmail: string) {
    return this.emailChangeTokenService.createEmailChangeToken(
      userId,
      newEmail,
    );
  }

  async validateEmailChangeToken(encodedToken: string) {
    return this.emailChangeTokenService.validateEmailChangeToken(encodedToken);
  }

  // Password reset token methods
  async createPasswordResetToken(userId: ProfileEntity['id'], email: string) {
    return this.passwordResetTokenService.createPasswordResetToken(
      userId,
      email,
    );
  }

  async validatePasswordResetToken(encodedToken: string) {
    return this.passwordResetTokenService.validatePasswordResetToken(
      encodedToken,
    );
  }

  // Two-factor auth token methods
  async createTwoFaToken(userId: ProfileEntity['id'], deviceId: string) {
    return this.twoFactorAuthTokenService.createTwoFaToken(userId, deviceId);
  }

  async validateTwoFaToken(encodedToken: string, deviceId: string) {
    return this.twoFactorAuthTokenService.validateTwoFaToken(
      encodedToken,
      deviceId,
    );
  }
}
