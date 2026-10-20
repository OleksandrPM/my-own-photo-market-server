import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

@Injectable()
export class CsrfTokenService {
  private static readonly TOKEN_SEPARATOR = '.';
  private static readonly RANDOM_BYTES_LENGTH = 32;
  private static readonly HEX_LENGTH = 64;

  constructor(private readonly configService: ConfigService) {}

  private getSecret(): string {
    const secret = this.configService.get<string>('CSRF_SECRET');

    if (!secret) {
      throw new Error('CSRF_SECRET is not configured');
    }

    return secret;
  }

  private buildMessage(deviceId: string, randomValue: string): string {
    return `${deviceId.length}!${deviceId}!${randomValue.length}!${randomValue}`;
  }

  private calculateHmac(deviceId: string, randomValue: string): string {
    const secret = this.getSecret();

    return createHmac('sha256', secret)
      .update(this.buildMessage(deviceId, randomValue))
      .digest('hex');
  }

  generateCsrfToken(deviceId: string): string {
    if (!deviceId) {
      throw new Error('Device ID is required for CSRF token generation');
    }

    const randomValue = randomBytes(
      CsrfTokenService.RANDOM_BYTES_LENGTH,
    ).toString('hex');

    const hmac = this.calculateHmac(deviceId, randomValue);

    return `${hmac}${CsrfTokenService.TOKEN_SEPARATOR}${randomValue}`;
  }

  validateCsrfToken(token: string, deviceId: string): boolean {
    if (!token || !deviceId) {
      return false;
    }

    const parts = token.split(CsrfTokenService.TOKEN_SEPARATOR);

    if (parts.length !== 2) {
      return false;
    }

    const [hmacFromToken, randomValue] = parts;

    if (!hmacFromToken || !randomValue) {
      return false;
    }

    if (hmacFromToken.length !== CsrfTokenService.HEX_LENGTH) {
      return false;
    }

    if (randomValue.length !== CsrfTokenService.HEX_LENGTH) {
      return false;
    }

    if (!/^[a-f0-9]+$/i.test(hmacFromToken)) {
      return false;
    }

    if (!/^[a-f0-9]+$/i.test(randomValue)) {
      return false;
    }

    const expectedHmac = this.calculateHmac(deviceId, randomValue);

    const a = Buffer.from(hmacFromToken, 'hex');
    const b = Buffer.from(expectedHmac, 'hex');

    if (a.length !== b.length) {
      return false;
    }

    return timingSafeEqual(a, b);
  }
}
