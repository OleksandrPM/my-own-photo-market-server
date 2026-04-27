export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
  maxAge?: number;
  domain?: string;
}

export enum CookieName {
  REFRESH_TOKEN = 'refreshToken',
  DEVICE_ID = 'deviceId',
}
