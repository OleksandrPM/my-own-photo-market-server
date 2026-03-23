import { TokenService } from '../token/token.service';
import { EmailService } from './email.service';
import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { buildEmailVerificationTemplate } from './templates/verification-email.template';
import { EmailSubject } from './email.types';
import { PathBuilderService } from '../path-builder/path-builder.service';
import { ApiRoutes } from '../path-builder/api.routes';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly pathBuilderService: PathBuilderService,
  ) {}

  async sendConfirmationEmail(user: User) {
    const rawToken = await this.tokenService.createEmailConfirmationToken(user);

    const endpoint = `${ApiRoutes.AUTH.BASE}/${ApiRoutes.AUTH.VERIFY_EMAIL}`;
    const verifyUrl = `${this.pathBuilderService.getApiFullPath(endpoint)}?token=${rawToken}`;

    // TODO: change 15 (expires in minutes) to variable
    const html = buildEmailVerificationTemplate(
      verifyUrl,
      15,
      user.username ?? undefined,
    );

    await this.emailService.sendEmail(
      user.email,
      EmailSubject.VERIFICATION,
      html,
    );
  }
}
