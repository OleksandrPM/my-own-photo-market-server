import { UserEntity } from './entities/user.entity';

export type UserUpdatePayload = Partial<UserEntity> & { password?: string };
