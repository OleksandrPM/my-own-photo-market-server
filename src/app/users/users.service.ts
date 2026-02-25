import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserUpdatePayload } from './dto/user-update-payload-type';
import { DbConnectionName } from '../db/db.config';
import { PasswordService } from '../password/password.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ImageStorageService } from '../storage/image-storage.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User, DbConnectionName.READER)
    private readonly readerRepository: Repository<User>,
    @InjectRepository(User, DbConnectionName.EDITOR)
    private readonly editorRepository: Repository<User>,
    private readonly passwordService: PasswordService,
    private readonly imageStorageService: ImageStorageService,
  ) {}

  // Helpers
  private async ensureEmailUnique(email: string) {
    const exists = await this.readerRepository.exists({ where: { email } });
    if (exists) {
      throw new ConflictException(`User with email ${email} already exists`);
    }
  }

  private async hashPasswordIfNeeded(
    dto: Partial<{ password: string }>,
    payload: UserUpdatePayload,
  ) {
    if (dto.password) {
      payload.passwordHash = await this.passwordService.hashPassword(
        dto.password,
      );
      delete payload.password;
    }
  }

  private async uploadAvatarIfNeeded(
    userId: number,
    avatar: Express.Multer.File | undefined,
  ): Promise<string | null> {
    if (!avatar) {
      return null;
    }

    return this.imageStorageService.uploadAvatar(userId, avatar);
  }

  private async getExistingUserOrThrow(id: number) {
    const user = await this.readerRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }

    return user;
  }

  // ---------- Public API ----------

  findAll() {
    return this.readerRepository.find();
  }

  findById(id: number) {
    return this.readerRepository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.readerRepository.findOneBy({ email });
  }

  async createUser(dto: CreateUserDto, avatar?: Express.Multer.File) {
    // Check email uniqueness before doing any other operations to save resources in case of conflict
    await this.ensureEmailUnique(dto.email);

    const payload: UserUpdatePayload = { ...dto };

    await this.hashPasswordIfNeeded(dto, payload);
    // Create user first to get the ID for avatar key building
    const userEntity = this.editorRepository.create(payload);
    const user = await this.editorRepository.save(userEntity);

    // Upload avatar if provided and get the key to save in user record
    let avatarKey: string | null = null;

    // Step 2: Try uploading avatar, but don't fail user creation
    if (avatar) {
      try {
        avatarKey = await this.uploadAvatarIfNeeded(user.id, avatar);
      } catch (err) {
        // TODO: Handle error
        // Log the error, but do not rollback user creation
        console.log(`Avatar upload failed for user ${user.id}: ${err.message}`);
      }
    }

    // Step 3: If avatar uploaded successfully, update user
    if (avatarKey) {
      try {
        // Update user record with avatar key
        await this.editorRepository.update(user.id, { avatarKey });
        // Return updated user with avatar key included
        return this.findById(user.id);
      } catch (err) {
        // If DB update fails, delete the uploaded avatar to avoid orphaned files
        await this.imageStorageService.deleteAvatar(user.id);
        console.log(
          `Failed to update avatarKey for user ${user.id}: ${err.message}`,
        );
      }
    } else {
      return user;
    }
  }

  async createAdmin(dto: CreateAdminDto) {
    const existing = await this.findByEmail(dto.email);

    if (existing) {
      if (existing.role === UserRole.ADMIN) {
        throw new ConflictException(
          `Admin with email ${dto.email} already exists`,
        );
      }

      await this.editorRepository.update(existing.id, {
        role: UserRole.ADMIN,
      });

      return this.findById(existing.id);
    }

    const payload: UserUpdatePayload = { ...dto, role: UserRole.ADMIN };

    await this.hashPasswordIfNeeded(dto, payload);

    const admin = this.editorRepository.create(payload);
    return this.editorRepository.save(admin);
  }

  async update(id: number, dto: UpdateUserDto, avatar?: Express.Multer.File) {
    await this.getExistingUserOrThrow(id);

    const payload: UserUpdatePayload = { ...dto };

    await this.hashPasswordIfNeeded(dto, payload);

    try {
      const avatarKey = await this.uploadAvatarIfNeeded(id, avatar);

      if (avatarKey) {
        payload.avatarKey = avatarKey;
      }
    } catch (error) {
      console.log(`Failed to update user avatar: ${error.message}`);
    }

    await this.editorRepository.update(id, payload);
    return this.findById(id);
  }

  async promote(id: number) {
    await this.getExistingUserOrThrow(id);

    await this.editorRepository.update(id, { role: UserRole.ADMIN });
    return this.findById(id);
  }

  async remove(id: number) {
    const user = await this.getExistingUserOrThrow(id);
    await this.editorRepository.delete(id);
    return user;
  }
}
