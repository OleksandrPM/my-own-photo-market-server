import { Response } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieName, CookieOptions } from './cookie.types';
import { CookieConfigService } from './cookie-config.service';

@Injectable()
export class CookieService {
  private readonly isLocalhost: boolean;
  private readonly isHttps: boolean;

  constructor(
    private readonly config: ConfigService,
    private readonly cookieConfig: CookieConfigService,
  ) {
    const origin = this.config.get<string>('ORIGIN_URL');

    if (!origin) {
      throw new Error('ORIGIN_URL is missing');
    }

    const hostname = new URL(origin).hostname;

    this.isLocalhost = hostname === 'localhost';
    this.isHttps = origin.startsWith('https://');
  }

  private getBaseOptions(): Pick<
    CookieOptions,
    'secure' | 'sameSite' | 'domain'
  > {
    if (this.isLocalhost) {
      return {
        secure: this.isHttps,
        sameSite: this.isHttps ? 'none' : 'lax',
        domain: undefined,
      };
    }

    return {
      secure: true,
      sameSite: 'none',
      domain: undefined,
    };
  }

  setCookie(res: Response, name: CookieName, value: string): void {
    const base = this.getBaseOptions();
    const config = this.cookieConfig.getCookieConfig(name);

    res.cookie(name, value, {
      ...base,
      ...config,
    });
  }

  clearCookie(res: Response, name: CookieName): void {
    const base = this.getBaseOptions();
    const config = this.cookieConfig.getCookieConfig(name);

    res.clearCookie(name, {
      ...base,
      ...config,
    });
  }
}
