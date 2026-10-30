import { ProfileEntity } from './entities/profile.entity';

export type ProfileUpdatePayload = Partial<ProfileEntity> & {
  password?: string;
};
