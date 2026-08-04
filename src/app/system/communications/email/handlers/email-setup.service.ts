import { Injectable } from '@nestjs/common';
import { PathBuilderService } from 'src/app/common/path-builder/path-builder.service';
import { EmailService } from '../email.service';
import { apiRoutes } from 'src/app/common/path-builder/api.routes';
import { calculateMinutesUntil } from 'src/app/common/utils';
import { EmailSubject } from '../email.types';

@Injectable()
export class EmailSetupService {
  constructor(
    private readonly pathBuilderService: PathBuilderService,
    private readonly emailService: EmailService,
  ) {}

  async sendSetupConfirmationEmail(
    email: string,
    encodedToken: string,
    expiresAt: Date,
  ) {
    const verifyUrl = `${this.pathBuilderService.getApiFullPath(apiRoutes.SETUP.BASE, apiRoutes.SETUP.CONFIRM_EMAIL)}?token=${encodedToken}`;

    const expiresInMinutes = calculateMinutesUntil(expiresAt);

    // TODO: create a proper email template for this
    const html = `<p>To complete the setup process, please click the link below to confirm your email address:</p>
      <p><a href="${verifyUrl}">Confirm Email</a></p>
      <p>${verifyUrl}</p>
      <p>This link will expire in ${expiresInMinutes} minutes.</p>`;

    await this.emailService.sendEmail(
      email,
      EmailSubject.SETUP_CONFIRMATION,
      html,
    );
  }
}
