import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hashPassword } from 'src/app/common/utils';
import { UsersRepository } from 'src/app/infrastructure/data/database/users/users.repository';
import { UserOrmEntity } from 'src/app/infrastructure/data/database/users/user.orm-entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { UserRole } from './user.types';
import { UserEntity } from './entities/user.entity';
import { AvatarStorageService } from 'src/app/infrastructure/storage/image-storage/avatar-storage.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly avatarStorageService: AvatarStorageService,
  ) {}

  // ---------- helpers ----------

  private async ensureEmailUnique(email: string) {
    const exists = await this.usersRepository.existsByEmail(email);

    if (exists) {
      throw new ConflictException(`User with email ${email} already exists`);
    }
  }

  private async hashPassword(password?: string): Promise<string | undefined> {
    return password ? hashPassword(password) : undefined;
  }

  private async requireUser(id: number): Promise<UserOrmEntity> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  private async uploadAvatarSafe(
    userId: number,
    file?: Express.Multer.File,
  ): Promise<string | null> {
    if (!file) return null;

    try {
      return await this.avatarStorageService.uploadAvatar(userId, file);
    } catch (e) {
      console.warn(`Avatar upload failed for user ${userId}`, e);
      return null;
    }
  }

  //  Read operations

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      return null;
    }

    const domain = UserEntity.from(user);

    return domain;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    const domain = UserEntity.from(user);

    return domain;
  }

  async existsAdmin(): Promise<boolean> {
    return this.usersRepository.existsAdmin();
  }

  // Write operations

  async createUserProfile(
    dto: CreateProfileDto,
    avatar?: Express.Multer.File,
  ): Promise<UserEntity> {
    await this.ensureEmailUnique(dto.email);

    const passwordHash = await this.hashPassword(dto.password);

    const ormUser = this.usersRepository.create({
      email: dto.email,
      username: dto.username ?? null,
      passwordHash: passwordHash!,
      role: UserRole.USER,
      isVerified: false,
    });

    const saved = await this.usersRepository.save(ormUser);

    const avatarKey = await this.uploadAvatarSafe(saved.id, avatar);

    if (avatarKey) {
      await this.usersRepository.update(saved.id, { avatarKey });
    }

    const fresh = await this.requireUser(saved.id);
    const domain = UserEntity.from(fresh);

    return domain;
  }

  async createAdmin(dto: CreateAdminDto): Promise<UserEntity> {
    await this.ensureEmailUnique(dto.email);

    const passwordHash = await this.hashPassword(dto.password);

    const admin = this.usersRepository.create({
      email: dto.email,
      username: null,
      passwordHash: passwordHash!,
      role: UserRole.ADMIN,
      isVerified: true,
    });

    const saved = await this.usersRepository.save(admin);

    const domain = UserEntity.from(saved);

    return domain;
  }

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
    avatar?: Express.Multer.File,
  ): Promise<UserEntity> {
    await this.requireUser(userId);

    const payload: Partial<UserOrmEntity> = {
      username: dto.username,
    };

    const passwordHash = await this.hashPassword(dto.password);
    if (passwordHash) {
      payload.passwordHash = passwordHash;
    }

    const avatarKey = await this.uploadAvatarSafe(userId, avatar);
    if (avatarKey) {
      payload.avatarKey = avatarKey;
    }

    await this.usersRepository.update(userId, payload);

    const fresh = await this.requireUser(userId);
    const domain = UserEntity.from(fresh);

    return domain;
  }

  async markEmailVerified(userId: number): Promise<UserEntity> {
    await this.requireUser(userId);
    await this.usersRepository.update(userId, { isVerified: true });

    const fresh = await this.requireUser(userId);
    const domain = UserEntity.from(fresh);

    return domain;
  }

  async deleteProfile(userId: number): Promise<void> {
    await this.requireUser(userId);
    await this.usersRepository.update(userId, { deletedAt: new Date() });
  }

  async removeProfile(userId: number): Promise<void> {
    await this.requireUser(userId);
    await this.usersRepository.delete(userId);
  }
}
