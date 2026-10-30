import { toMs } from 'src/app/common/utils/time.utils';
import { CookieName } from './cookie.types';

export const COOKIES_TTL = {
  [CookieName.REFRESH_TOKEN]: toMs.days(30), // 30 days
  [CookieName.DEVICE_ID]: toMs.days(30), // 30 days
  [CookieName.SETUP_SESSION_ID]: toMs.minutes(30), // 30 minutes
  [CookieName.CSRF_TOKEN]: toMs.hours(1), // 1 hour
};
