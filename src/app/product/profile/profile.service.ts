import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { hashPassword } from 'src/app/common/utils';
import { ProfilesRepository } from 'src/app/infrastructure/data/database/profiles/profiles.repository';
import { ProfileOrmEntity } from 'src/app/infrastructure/data/database/profiles/profile.orm-entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UserRole } from './profile.types';
import { ProfileEntity } from './entities/profile.entity';
import { AvatarStorageService } from 'src/app/infrastructure/storage/image-storage/avatar-storage.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ERROR_CODES } from 'src/types/error.types';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly profilesRepository: ProfilesRepository,
    private readonly avatarStorageService: AvatarStorageService,
  ) {}

  private readonly logger = new Logger(ProfilesService.name);

  // ---------- helpers ----------

  private async ensureEmailUnique(email: string) {
    const exists = await this.profilesRepository.existsByEmail(email);

    if (exists) {
      this.logger.warn(`Email: ${email} is not unique`);

      throw new ConflictException({
        code: ERROR_CODES.CONFLICT,
        message: 'Operation not allowed',
      });
    }
  }

  private async hashPassword(password?: string): Promise<string | undefined> {
    return password ? hashPassword(password) : undefined;
  }

  private async requireUser(id: number): Promise<ProfileOrmEntity> {
    const user = await this.profilesRepository.findById(id);

    if (!user) {
      throw new NotFoundException({
        code: ERROR_CODES.NOT_FOUND,
        message: `User ${id} not found`,
      });
    }

    return user;
  }

  private async uploadAvatarSafe(
    userId: number,
    file?: Express.Multer.File,
  ): Promise<string | null> {
    if (!file) return null;

    try {
      return this.avatarStorageService.uploadAvatar(userId, file);
    } catch (e) {
      console.warn(`Avatar upload failed for user ${userId}`, e);
      return null;
    }
  }

  //  Read operations

  async findById(id: number): Promise<ProfileEntity | null> {
    const user = await this.profilesRepository.findById(id);

    if (!user) {
      return null;
    }

    const domain = ProfileEntity.from(user);

    return domain;
  }

  async findByEmail(email: string): Promise<ProfileEntity | null> {
    const user = await this.profilesRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    const domain = ProfileEntity.from(user);

    return domain;
  }

  async existsAdmin(): Promise<boolean> {
    return this.profilesRepository.existsAdmin();
  }

  // Write operations

  async createUserProfile(
    dto: CreateProfileDto,
    avatar?: Express.Multer.File,
  ): Promise<ProfileEntity> {
    await this.ensureEmailUnique(dto.email);

    const passwordHash = await this.hashPassword(dto.password);

    const ormUser = this.profilesRepository.create({
      email: dto.email,
      username: dto.username ?? null,
      passwordHash: passwordHash!,
      role: UserRole.USER,
      isVerified: false,
    });

    const saved = await this.profilesRepository.save(ormUser);

    // Upload avatar if provided
    await this.uploadAvatarSafe(saved.id, avatar);

    const fresh = await this.requireUser(saved.id);
    const domain = ProfileEntity.from(fresh);

    return domain;
  }

  async createAdmin(dto: CreateAdminDto): Promise<ProfileEntity> {
    await this.ensureEmailUnique(dto.email);

    const passwordHash = await this.hashPassword(dto.password);

    const admin = this.profilesRepository.create({
      email: dto.email,
      username: null,
      passwordHash: passwordHash!,
      role: UserRole.ADMIN,
      isVerified: true,
    });

    const saved = await this.profilesRepository.save(admin);

    const domain = ProfileEntity.from(saved);

    return domain;
  }

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
    avatar?: Express.Multer.File,
  ): Promise<ProfileEntity> {
    await this.requireUser(userId);

    const payload: Partial<ProfileOrmEntity> = {
      username: dto.username,
    };

    const passwordHash = await this.hashPassword(dto.password);
    if (passwordHash) {
      payload.passwordHash = passwordHash;
    }

    // Upload avatar if provided
    await this.uploadAvatarSafe(userId, avatar);

    await this.profilesRepository.update(userId, payload);

    const fresh = await this.requireUser(userId);
    const domain = ProfileEntity.from(fresh);

    return domain;
  }

  async markEmailVerified(userId: number): Promise<ProfileEntity> {
    await this.requireUser(userId);
    await this.profilesRepository.update(userId, { isVerified: true });

    const fresh = await this.requireUser(userId);
    const domain = ProfileEntity.from(fresh);

    return domain;
  }

  async deleteProfile(userId: number): Promise<void> {
    await this.requireUser(userId);
    await this.profilesRepository.update(userId, { deletedAt: new Date() });
  }

  async removeProfile(userId: number): Promise<void> {
    await this.requireUser(userId);
    await this.profilesRepository.delete(userId);
  }
}
