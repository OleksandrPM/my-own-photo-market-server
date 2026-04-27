import { CookieName } from './cookies.types';

export const COOKIES_TTL = {
  [CookieName.REFRESH_TOKEN]: 7 * 24 * 60 * 60 * 1000,
  [CookieName.DEVICE_ID]: 365 * 24 * 60 * 60 * 1000,
};
