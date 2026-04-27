// src/modules/profiles/dto/profile-response.dto.ts
import { Expose } from 'class-transformer';
import { UserRole } from '../user.types';
import { UserEntity } from '../entities/user.entity';

export class ProfileResponseDto {
  @Expose()
  id!: number;

  @Expose()
  email!: string;

  @Expose()
  username!: string | null;

  @Expose()
  role!: UserRole;

  @Expose()
  isVerified!: boolean;

  @Expose()
  avatarUrl!: string | null;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  static fromDomain(
    user: UserEntity,
    avatarUrl: string | null,
  ): ProfileResponseDto {
    const dto = new ProfileResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.username = user.username;
    dto.role = user.role;
    dto.isVerified = user.isVerified;
    dto.avatarUrl = avatarUrl;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
