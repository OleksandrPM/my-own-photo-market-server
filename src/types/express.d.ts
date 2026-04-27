import { UserRole } from 'src/app/product/profiles/user.types';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: UserRole;
      isVerified: boolean;
    }

    interface Request {
      user: User;
    }
  }
}

export {};
