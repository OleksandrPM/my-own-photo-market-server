import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BrevoClient } from '@getbrevo/brevo';
import { EmailSubject } from './email.types';

@Injectable()
export class EmailService {
  private brevo: BrevoClient;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('BREVO_API_KEY');
    if (!apiKey) {
      throw new Error('BREVO_API_KEY is missing');
    }

    this.brevo = new BrevoClient({ apiKey });
  }

  async sendEmail(to: string, subject: EmailSubject, html: string) {
    const from = this.config.get<string>('BREVO_FROM');
    if (!from) {
      throw new Error('BREVO_FROM is missing');
    }

    return this.brevo.transactionalEmails.sendTransacEmail({
      sender: { name: 'My Own Photo Market', email: from },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });
  }
}
