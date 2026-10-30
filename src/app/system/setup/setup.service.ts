import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SetupAdminDto } from './dto/setup-admin.dto';
import { ProfilesService } from '../../product/profile/profile.service';
import { SetupVerifyEmailDto } from './dto/setup-verify-email.dto';
import { SetupIsEnabledResponseDto } from './dto/setup-is-enabled-response.dto';
import { TokenManagerService } from '../token/token-manager.service';
import { EmailManagerService } from '../communication/email/email-manager.service';
import { SetupStatusResponseDto } from './dto/setup-status-response.dto';
import { SetupCreatedminResponseDto } from './dto/setup-create-admin-response.dto';
import { TypedToken, TokenType } from '../token/token.types';
import { randomUUID, UUID } from 'crypto';

@Injectable()
export class SetupService {
  private readonly logger = new Logger(SetupService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly tokenService: TokenManagerService,
    private readonly profilesService: ProfilesService,
    private readonly emailService: EmailManagerService,
  ) {}

  async isSetupEnabled(): Promise<SetupIsEnabledResponseDto> {
    const isAdminExists = await this.profilesService.existsAdmin();

    return { isSetupEnabled: !isAdminExists };
  }

  async verifyOwnerEmail({
    email,
  }: SetupVerifyEmailDto): Promise<{ message: string; sessionId: UUID }> {
    const ownerEmail = this.config.get<string>('OWNER_EMAIL');

    // check if OWNER_EMAIL configured
    if (!ownerEmail) {
      throw new UnauthorizedException('Owner email not configured');
    }

    // revoke all previous setup tokens
    await this.tokenService.revokeTokensByType(TokenType.INITIAL_SETUP);

    const response = {
      message: `Check your email ${email}`,
      sessionId: randomUUID(),
    };

    if (email !== ownerEmail) {
      this.logger.warn(`Invalid email attempt: ${email}`);

      return response;
    }

    const { encodedToken, tokenRecord } =
      await this.tokenService.createSetupToken(ownerEmail, response.sessionId);

    await this.emailService.sendSetupConfirmationEmail(
      ownerEmail,
      encodedToken,
      tokenRecord.expiresAt,
    );

    return response;
  }

  async confirmOwnerEmail(
    encodedToken: string,
  ): Promise<{ isConfirmed: boolean }> {
    const tokenRecord =
      await this.tokenService.validateSetupTokenFromEmail(encodedToken);

    if (!tokenRecord.payload) {
      throw new UnauthorizedException('Setup token has no payload');
    }

    const updatedTokenRecord = await this.tokenService.confirmOwnerEmail(
      tokenRecord.id,
    );

    return {
      isConfirmed: updatedTokenRecord.payload.isConfirmed,
    };
  }

  async getStatus(sessionId: string): Promise<SetupStatusResponseDto> {
    const { isEmailConfirmed } =
      await this.tokenService.isOwnerEmailConfirmed(sessionId);

    return { isEmailConfirmed };
  }

  async createInitialAdmin(
    { email, password }: SetupAdminDto,
    sessionId: string,
  ): Promise<SetupCreatedminResponseDto> {
    const tokenRecord: TypedToken<TokenType.INITIAL_SETUP> | null =
      await this.tokenService.getSetupTokenBySessionId(sessionId);

    if (!tokenRecord) {
      throw new UnauthorizedException('No setup token found for this session');
    }

    const {
      id,
      sessionId: tokenSessionId,
      payload: { ownerEmail, isConfirmed },
    } = tokenRecord;

    if (!ownerEmail || !isConfirmed) {
      throw new UnauthorizedException('Invalid or expired setup token');
    }

    if (!isConfirmed) {
      throw new UnauthorizedException('Owner email is not confirmed');
    }

    if (sessionId !== tokenSessionId) {
      throw new UnauthorizedException('Session ID does not match');
    }

    const user = await this.profilesService.createAdmin({
      email: ownerEmail,
      password: password,
    });

    await this.tokenService.revokeTokenById(id);

    if (user) {
      return { isAdminCreated: true };
    } else {
      return { isAdminCreated: false };
    }
  }
}
