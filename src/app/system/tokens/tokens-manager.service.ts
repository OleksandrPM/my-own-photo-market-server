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
import { UserTokenType } from './tokens.types';

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

  async revokeTokensByType(tokenType: UserTokenType, date = new Date()) {
    return this.tokenService.revokeTokensByType(tokenType, date);
  }

  // CSRF token methods
  generateCsrfToken(bindingValue: string): string {
    return this.csrfTokenService.generateCsrfToken(bindingValue);
  }

  validateCsrfToken(token: string, bindingValue: string): boolean {
    return this.csrfTokenService.validateCsrfToken(token, bindingValue);
  }

  // Access token methods
  generateAccessToken(user: UserEntity): string {
    return this.accessTokenService.generateAccessToken(user);
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
  async createRefreshToken(
    user: UserEntity,
    deviceId: string,
    sessionId: string,
  ) {
    return this.refreshTokenService.createRefreshToken(
      user,
      deviceId,
      sessionId,
    );
  }

  async validateRefreshToken(
    tokenId: number,
    token: string,
    deviceId: string,
    sessionId: string,
  ) {
    return this.refreshTokenService.validateRefreshToken(
      tokenId,
      token,
      deviceId,
      sessionId,
    );
  }

  // Email confirmation token methods
  async createEmailConfirmationToken(user: UserEntity) {
    return this.emailConfirmTokenService.createEmailConfirmationToken(user);
  }

  async validateEmailConfirmationToken(tokenId: number, token: string) {
    return this.emailConfirmTokenService.validateEmailConfirmationToken(
      tokenId,
      token,
    );
  }

  // Email change token methods
  async createEmailChangeToken(user: UserEntity, newEmail: string) {
    return this.emailChangeTokenService.createEmailChangeToken(user, newEmail);
  }

  async validateEmailChangeToken(tokenId: number, token: string) {
    return this.emailChangeTokenService.validateEmailChangeToken(
      tokenId,
      token,
    );
  }

  // Password reset token methods
  async createPasswordResetToken(user: UserEntity, email: string) {
    return this.passwordResetTokenService.createPasswordResetToken(user, email);
  }

  async validatePasswordResetToken(tokenId: number, token: string) {
    return this.passwordResetTokenService.validatePasswordResetToken(
      tokenId,
      token,
    );
  }

  // Two-factor auth token methods
  async createTwoFaToken(user: UserEntity, sessionId: string) {
    return this.twoFactorAuthTokenService.createTwoFaToken(user, sessionId);
  }

  async validateTwoFaToken(tokenId: number, token: string, sessionId: string) {
    return this.twoFactorAuthTokenService.validateTwoFaToken(
      tokenId,
      token,
      sessionId,
    );
  }
}
