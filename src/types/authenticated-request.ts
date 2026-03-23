import { Request } from 'express';
import { UserRole } from 'src/app/users/entities/user.entity';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
