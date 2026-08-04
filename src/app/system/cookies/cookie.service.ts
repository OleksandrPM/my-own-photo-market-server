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
  private readonly isHttps: boolean;

  constructor(private readonly config: ConfigService) {
    const origin = this.config.get<string>('ORIGIN_URL');

    if (!origin) {
      throw new Error('ORIGIN_URL is missing');
    }

    this.originHostname = new URL(origin).hostname;
    this.isLocalhost = this.originHostname === 'localhost';
    this.isHttps = origin.startsWith('https://');
  }

  private getCookieBaseOptions(): Partial<CookieOptions> {
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
      domain: undefined, // Let the browser set the domain to the request's origin
    };
  }

  private setCookie(
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

  private clearCookie(res: Response, name: CookieName, path = '/') {
    const base = this.getCookieBaseOptions();

    res.clearCookie(name, {
      path,
      domain: base.domain,
      secure: base.secure,
      sameSite: base.sameSite,
    });
  }

  // CSRF token cookie methods
  setCsrfCookie(res: Response, csrfToken: string) {
    this.setCookie(res, CookieName.CSRF_TOKEN, csrfToken, {
      httpOnly: false,
      path: '/',
      maxAge: COOKIES_TTL[CookieName.CSRF_TOKEN],
    });
  }

  clearCsrfCookie(res: Response) {
    this.clearCookie(res, CookieName.CSRF_TOKEN);
  }

  // Refresh token cookie methods
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

  // Device ID cookie methods
  setDeviceIdCookie(res: Response, deviceId: string) {
    this.setCookie(res, CookieName.DEVICE_ID, deviceId, {
      httpOnly: true,
      path: '/',
      maxAge: COOKIES_TTL[CookieName.DEVICE_ID],
    });
  }

  clearDeviceIdCookie(res: Response) {
    this.clearCookie(res, CookieName.DEVICE_ID, '/');
  }

  // Setup session cookie methods
  setSetupSessionCookie(res: Response, sessionId: string) {
    this.setCookie(res, CookieName.SETUP_SESSION_ID, sessionId, {
      httpOnly: true,
      path: `/${apiRoutes.SETUP.BASE}`,
      maxAge: COOKIES_TTL[CookieName.SETUP_SESSION_ID],
    });
  }

  clearSetupSessionCookie(res: Response) {
    this.clearCookie(
      res,
      CookieName.SETUP_SESSION_ID,
      `/${apiRoutes.SETUP.BASE}`,
    );
  }
}
