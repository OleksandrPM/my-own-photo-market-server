import { UserOrmEntity } from './user.orm-entity';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';

export class UserMapper {
  static toDomain(orm: UserOrmEntity): UserEntity {
    return UserEntity.from({
      id: orm.id,
      email: orm.email,
      username: orm.username,
      role: orm.role,
      avatarKey: orm.avatarKey,
      isVerified: orm.isVerified,
      deletedAt: orm.deletedAt,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  /**
   * Часто достатньо робити toOrm лише для create/update,
   * і не “перетирати” поля типу createdAt/updatedAt вручну.
   */
  static toOrm(domain: UserEntity): Partial<UserOrmEntity> {
    return {
      id: domain.id,
      email: domain.email,
      username: domain.username,
      role: domain.role,
      avatarKey: domain.avatarKey,
      isVerified: domain.isVerified,
      deletedAt: domain.deletedAt,
    };
  }
}
