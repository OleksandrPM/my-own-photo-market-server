import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

@Injectable()
export class CsrfTokenService {
  constructor(private readonly configService: ConfigService) {}

  private getSecret(): string {
    const secret = this.configService.get<string>('CSRF_SECRET');

    if (!secret) {
      throw new Error('CSRF_SECRET is not configured');
    }

    return secret;
  }

  private buildMessage(bindingValue: string, randomValue: string): string {
    return `${bindingValue.length}!${bindingValue}!${randomValue.length}!${randomValue}`;
  }

  generateCsrfToken(bindingValue: string): string {
    if (!bindingValue) {
      throw new Error('Binding value is required for CSRF token generation');
    }

    const secret = this.getSecret();
    const randomValue = randomBytes(32).toString('hex');

    const message = this.buildMessage(bindingValue, randomValue);
    const hmac = createHmac('sha256', secret).update(message).digest('hex');

    return `${hmac}.${randomValue}`;
  }

  validateCsrfToken(token: string, bindingValue: string): boolean {
    if (!token || !bindingValue) {
      return false;
    }

    const parts = token.split('.');
    if (parts.length !== 2) return false;

    const [hmacFromToken, randomValue] = parts;
    if (!hmacFromToken || !randomValue) return false;

    const secret = this.getSecret();
    const message = this.buildMessage(bindingValue, randomValue);

    const expectedHmac = createHmac('sha256', secret)
      .update(message)
      .digest('hex');

    const a = Buffer.from(hmacFromToken, 'hex');
    const b = Buffer.from(expectedHmac, 'hex');

    if (a.length !== b.length) return false;

    return timingSafeEqual(a, b);
  }
}
