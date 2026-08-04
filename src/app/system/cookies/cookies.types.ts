type SameSiteOption = 'strict' | 'lax' | 'none';

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: SameSiteOption;
  path?: string;
  maxAge?: number;
  domain?: string;
}

export enum CookieName {
  CSRF_TOKEN = 'csrfToken',
  REFRESH_TOKEN = 'refreshToken',
  DEVICE_ID = 'deviceId',
  SETUP_SESSION_ID = 'setupSessionId',
}
