import { Injectable } from '@nestjs/common';
import { EmailSetupService } from './handlers/email-setup.service';
import { EmailVerificationService } from './handlers/email-verification.service';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';

@Injectable()
export class EmailManagerService {
  constructor(
    private readonly emailSetupService: EmailSetupService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  // Setup related email methods
  async sendSetupConfirmationEmail(
    email: string,
    rawToken: string,
    expiresAt: Date,
  ) {
    await this.emailSetupService.sendSetupConfirmationEmail(
      email,
      rawToken,
      expiresAt,
    );
  }

  // Authentication related email methods
  async sendConfirmationEmail(
    user: UserEntity,
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
