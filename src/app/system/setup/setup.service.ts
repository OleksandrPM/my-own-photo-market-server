import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SetupAdminDto } from './dto/setup-admin.dto';
import { ProfilesService } from '../../product/profiles/profiles.service';
import { SetupVerifyEmailDto } from './dto/setup-verify-email.dto';
import { SetupIsEnabledResponseDto } from './dto/setup-is-enabled-response.dto';
import { TokenManagerService } from '../tokens/tokens-manager.service';
import { EmailManagerService } from '../communications/email/email-manager.service';

@Injectable()
export class SetupService {
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

  async sendSetupEmail({ email }: SetupVerifyEmailDto, deviceId: string) {
    const ownerEmail = this.config.get<string>('OWNER_EMAIL');

    if (!ownerEmail) {
      throw new UnauthorizedException('Owner email not configured');
    }

    if (email !== ownerEmail) {
      throw new UnauthorizedException(
        'Provided email does not match owner email',
      );
    }

    const response = await this.tokenService.createSetupToken(
      ownerEmail,
      deviceId,
    );

    await this.emailService.sendSetupConfirmationEmail(
      ownerEmail,
      response.rawToken,
      response.expiresAt,
    );

    return { message: 'Setup token generated and sent to owner email' };
  }

  async confirmOwnerEmail(token: string) {
    const tokenRecord = await this.tokenService.validateSetupToken(token);

    if (!tokenRecord || !tokenRecord.payload) {
      throw new UnauthorizedException('Invalid or expired setup token');
    }

    const { tokenRecord: updatedTokenRecord } =
      await this.tokenService.confirmOwnerEmail(tokenRecord.id);

    const payload = updatedTokenRecord.payload as {
      ownerEmail: string;
      isConfirmed: boolean;
    };

    return { isConfirmed: payload.isConfirmed };
  }

  async isOwnerEmailConfirmed(email: string, deviceId: string) {
    const { isEmailConfirmed } = await this.tokenService.isOwnerEmailConfirmed(
      email,
      deviceId,
    );

    return { isEmailConfirmed };
  }

  async createInitialAdmin(dto: SetupAdminDto, deviceId: string) {
    const token = await this.tokenService.validateSetupToken(dto.token);

    if (!token || !token.payload) {
      throw new UnauthorizedException('Invalid or expired setup token');
    }

    const payload = token.payload as {
      ownerEmail: string;
      isConfirmed: boolean;
    };

    if (!payload.isConfirmed) {
      throw new UnauthorizedException('Owner email is not confirmed');
    }

    if (dto.email !== payload.ownerEmail) {
      throw new UnauthorizedException(
        'Provided email does not match owner email',
      );
    }

    if (deviceId !== token.deviceId) {
      throw new UnauthorizedException('Device ID does not match');
    }

    const user = await this.profilesService.createAdmin({
      email: dto.email,
      password: dto.password,
    });

    await this.tokenService.revokeToken(token.id);

    return user;
  }
}
