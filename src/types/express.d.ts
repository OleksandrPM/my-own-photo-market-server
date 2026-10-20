import type { AuthenticatedUser } from '../app/system/auth/auth.types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
