import { Request } from 'express';
import { AuthenticatedUser } from 'src/app/product/profiles/user.types';

export type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};
