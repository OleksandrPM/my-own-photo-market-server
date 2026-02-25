import { Expose } from 'class-transformer';
import { UserRole } from '../entities/user.entity';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  username: string | null;

  @Expose()
  role: UserRole;

  @Expose()
  avatarKey: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
