import { User } from '../entities/user.entity';

export type UserUpdatePayload = Partial<User> & { password?: string };
