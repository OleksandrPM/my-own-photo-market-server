import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ApiRoutes } from '../path-builder/api.routes';
import { ConfigService } from '@nestjs/config';

export enum CookieName {
  REFRESH_TOKEN = 'refreshToken',
  DEVICE_ID = 'deviceId',
}

export const cookieMaxAge = {
  refreshToken: 7 * 24 * 60 * 60 * 1000,
  deviceId: 365 * 24 * 60 * 60 * 1000,
};

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
  maxAge?: number;
  domain?: string;
}

@Injectable()
export class CookieService {
  readonly refreshPath = `/${ApiRoutes.AUTH.BASE}/${ApiRoutes.AUTH.REFRESH}`;
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
    if (this.isLocalhost) {
      return {
        secure: false, // localhost cannot use secure cookies
        sameSite: 'none', // required for cross-origin localhost
        domain: undefined, // MUST NOT set domain on localhost
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
      maxAge: cookieMaxAge.refreshToken,
    });
  }

  clearRefreshTokenCookie(res: Response) {
    this.clearCookie(res, CookieName.REFRESH_TOKEN, this.refreshPath);
  }

  setDeviceIdCookie(res: Response, deviceId: string) {
    this.setCookie(res, CookieName.DEVICE_ID, deviceId, {
      httpOnly: false,
      path: '/',
      maxAge: cookieMaxAge.deviceId,
    });
  }

  clearDeviceIdCookie(res: Response) {
    this.clearCookie(res, CookieName.DEVICE_ID, '/');
  }
}
