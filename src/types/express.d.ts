import { UserRole } from 'src/app/users/entities/user.entity';

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
