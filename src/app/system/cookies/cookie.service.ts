import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { apiRoutes } from 'src/app/common/path-builder/api.routes';
import { CookieName, CookieOptions } from './cookies.types';
import { COOKIES_TTL } from './cookies.ttl';

@Injectable()
export class CookieService {
  readonly refreshPath = `/${apiRoutes.AUTH.BASE}/${apiRoutes.AUTH.REFRESH}`;
  private readonly isLocalhost: boolean;
  private readonly originHostname: string;

  constructor(private readonly config: ConfigService) {
    const origin = this.config.get<string>('ORIGIN_URL');

    if (!origin) {
      throw new Error('ORIGIN_URL is missing');
    }

    this.originHostname = new URL(origin).hostname;
    this.isLocalhost = this.originHostname === 'localhost';
  }

  private getCookieBaseOptions(): Partial<CookieOptions> {
    const isHttps = this.config
      .get<string>('ORIGIN_URL')
      ?.startsWith('https://');

    if (this.isLocalhost) {
      return {
        secure: isHttps,
        sameSite: isHttps ? 'none' : 'lax',
        domain: undefined,
      };
    }

    return {
      secure: true,
      sameSite: 'none',
      domain: `.${this.originHostname}`,
    };
  }

  setCookie(
    res: Response,
    name: CookieName,
    value: string,
    options: CookieOptions,
  ) {
    const base = this.getCookieBaseOptions();

    res.cookie(name, value, {
      httpOnly: options.httpOnly ?? false,
      secure: base.secure,
      sameSite: base.sameSite,
      domain: base.domain,
      path: options.path ?? '/',
      maxAge: options.maxAge,
    });
  }

  clearCookie(res: Response, name: CookieName, path = '/') {
    const base = this.getCookieBaseOptions();

    res.clearCookie(name, {
      path,
      domain: base.domain,
    });
  }

  setRefreshTokenCookie(res: Response, token: string) {
    this.setCookie(res, CookieName.REFRESH_TOKEN, token, {
      httpOnly: true,
      path: this.refreshPath,
      maxAge: COOKIES_TTL[CookieName.REFRESH_TOKEN],
    });
  }

  clearRefreshTokenCookie(res: Response) {
    this.clearCookie(res, CookieName.REFRESH_TOKEN, this.refreshPath);
  }

  setDeviceIdCookie(res: Response, deviceId: string) {
    this.setCookie(res, CookieName.DEVICE_ID, deviceId, {
      httpOnly: false,
      path: '/',
      maxAge: COOKIES_TTL[CookieName.DEVICE_ID],
    });
  }

  clearDeviceIdCookie(res: Response) {
    this.clearCookie(res, CookieName.DEVICE_ID, '/');
  }
}
