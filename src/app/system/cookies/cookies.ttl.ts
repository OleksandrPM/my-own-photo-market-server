import { CookieName } from './cookies.types';

export const COOKIES_TTL = {
  [CookieName.REFRESH_TOKEN]: 30 * 24 * 60 * 60 * 1000, // 30 days
  [CookieName.DEVICE_ID]: 30 * 24 * 60 * 60 * 1000, // 30 days
  [CookieName.SETUP_SESSION_ID]: 30 * 60 * 1000, // 30 minutes
  [CookieName.CSRF_TOKEN]: 60 * 60 * 1000, // 60 minutes
};
