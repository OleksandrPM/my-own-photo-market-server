import { Injectable } from '@nestjs/common';
import { RefreshTokenService } from './handlers/refresh-token.service';
import { EmailConfirmTokenService } from './handlers/email-confirm-token.service';
import { EmailChangeTokenService } from './handlers/email-change-token.service';
import { TokenService } from './tokens.service';
import { UserEntity } from '../../product/profiles/entities/user.entity';
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
  generateAccessToken(userId: UserEntity['id']): string {
    return this.accessTokenService.generateAccessToken(userId);
  }

  // Setup token methods
  async createSetupToken(ownerEmail: string, deviceId: string) {
    return this.setupTokenService.createSetupToken(ownerEmail, deviceId);
  }

  async getSetupTokenBySessionId(sessionId: string) {
    return this.setupTokenService.getSetupTokenBySessionId(sessionId);
  }

  async validateSetupToken(tokenId: number, token: string, sessionId: string) {
    return this.setupTokenService.validateSetupToken(tokenId, token, sessionId);
  }

  async validateSetupTokenFromEmail(tokenId: number, token: string) {
    return this.setupTokenService.validateSetupTokenFromEmail(tokenId, token);
  }

  async confirmOwnerEmail(tokenId: number) {
    return this.setupTokenService.confirmOwnerEmail(tokenId);
  }

  async isOwnerEmailConfirmed(sessionId: string) {
    return this.setupTokenService.isOwnerEmailConfirmed(sessionId);
  }

  // Refresh token methods
  async createRefreshToken(userId: UserEntity['id'], deviceId: string) {
    return this.refreshTokenService.createRefreshToken(userId, deviceId);
  }

  async validateRefreshToken(tokenId: number, token: string, deviceId: string) {
    return this.refreshTokenService.validateRefreshToken(
      tokenId,
      token,
      deviceId,
    );
  }

  // Email confirmation token methods
  async createEmailConfirmationToken(userId: UserEntity['id']) {
    return this.emailConfirmTokenService.createEmailConfirmationToken(userId);
  }

  async validateEmailConfirmationToken(tokenId: number, token: string) {
    return this.emailConfirmTokenService.validateEmailConfirmationToken(
      tokenId,
      token,
    );
  }

  // Email change token methods
  async createEmailChangeToken(userId: UserEntity['id'], newEmail: string) {
    return this.emailChangeTokenService.createEmailChangeToken(
      userId,
      newEmail,
    );
  }

  async validateEmailChangeToken(tokenId: number, token: string) {
    return this.emailChangeTokenService.validateEmailChangeToken(
      tokenId,
      token,
    );
  }

  // Password reset token methods
  async createPasswordResetToken(userId: UserEntity['id'], email: string) {
    return this.passwordResetTokenService.createPasswordResetToken(
      userId,
      email,
    );
  }

  async validatePasswordResetToken(tokenId: number, token: string) {
    return this.passwordResetTokenService.validatePasswordResetToken(
      tokenId,
      token,
    );
  }

  // Two-factor auth token methods
  async createTwoFaToken(userId: UserEntity['id'], sessionId: string) {
    return this.twoFactorAuthTokenService.createTwoFaToken(userId, sessionId);
  }

  async validateTwoFaToken(tokenId: number, token: string, sessionId: string) {
    return this.twoFactorAuthTokenService.validateTwoFaToken(
      tokenId,
      token,
      sessionId,
    );
  }
}
