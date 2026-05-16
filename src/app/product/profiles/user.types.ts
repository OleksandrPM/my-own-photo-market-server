export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface AuthenticatedUser {
  id: number;
  email: string;
  role: UserRole;
  isVerified: boolean;
}
