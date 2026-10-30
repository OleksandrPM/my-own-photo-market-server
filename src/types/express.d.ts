import type { AuthenticatedUser } from 'src/app/system/auth/auth.types';
import { CookieName } from 'src/app/system/auth/auth.constants';

export type RequestCookies = Partial<Record<CookieName, string>>;

declare global {
  namespace Express {
    interface User extends AuthenticatedUser {}
    interface Request {
      cookies: RequestCookies;
    }
  }
}

export {};
