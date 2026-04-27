import { Request } from 'express';
import { AuthenticatedUser } from 'src/app/product/profiles/user.types';

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
