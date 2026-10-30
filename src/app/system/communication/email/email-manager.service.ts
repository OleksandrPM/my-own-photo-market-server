import { Injectable } from '@nestjs/common';
import { EmailSetupService } from './handlers/email-setup.service';
import { EmailVerificationService } from './handlers/email-verification.service';
import { ProfileEntity } from 'src/app/product/profile/entities/profile.entity';

@Injectable()
export class EmailManagerService {
  constructor(
    private readonly emailSetupService: EmailSetupService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  // Setup related email methods
  async sendSetupConfirmationEmail(
    email: string,
    encodedToken: string,
    expiresAt: Date,
  ) {
    await this.emailSetupService.sendSetupConfirmationEmail(
      email,
      encodedToken,
      expiresAt,
    );
  }

  // Authentication related email methods
  async sendConfirmationEmail(
    user: ProfileEntity,
    rawToken: string,
    expiresAt: Date,
  ) {
    await this.emailVerificationService.sendConfirmationEmail(
      user,
      rawToken,
      expiresAt,
    );
  }
}
