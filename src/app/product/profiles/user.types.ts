export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
}
