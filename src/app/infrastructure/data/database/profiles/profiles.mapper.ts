import { ProfileOrmEntity } from './profile.orm-entity';
import { ProfileEntity } from 'src/app/product/profile/entities/profile.entity';

export class ProfileMapper {
  static toDomain(orm: ProfileOrmEntity): ProfileEntity {
    return ProfileEntity.from({
      id: orm.id,
      email: orm.email,
      username: orm.username,
      role: orm.role,
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
  static toOrm(domain: ProfileEntity): Partial<ProfileOrmEntity> {
    return {
      id: domain.id,
      email: domain.email,
      username: domain.username,
      role: domain.role,
      isVerified: domain.isVerified,
      deletedAt: domain.deletedAt,
    };
  }
}
