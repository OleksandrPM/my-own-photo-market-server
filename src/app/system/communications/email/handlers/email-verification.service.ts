import { Injectable } from '@nestjs/common';
import { PathBuilderService } from 'src/app/common/path-builder/path-builder.service';
import { apiRoutes } from 'src/app/common/path-builder/api.routes';
import { EmailService } from '../email.service';
import { buildEmailVerificationTemplate } from '../templates';
import { EmailSubject } from '../email.types';
import { calculateMinutesUntil } from 'src/app/common/utils';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';

@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly pathBuilderService: PathBuilderService,
    private readonly emailService: EmailService,
  ) {}

  async sendConfirmationEmail(
    user: UserEntity,
    rawToken: string,
    expiresAt: Date,
  ): Promise<void> {
    const verifyUrl = `${this.pathBuilderService.getApiFullPath(apiRoutes.AUTH.BASE, apiRoutes.AUTH.VERIFY_EMAIL)}?token=${rawToken}`;
    const expiresInMinutes = calculateMinutesUntil(expiresAt);

    const html = buildEmailVerificationTemplate(
      verifyUrl,
      expiresInMinutes,
      user.username ?? undefined,
    );

    await this.emailService.sendEmail(
      user.email,
      EmailSubject.VERIFICATION,
      html,
    );
  }
}
