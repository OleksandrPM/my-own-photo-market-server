import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserUpdatePayload } from './dto/user-update-payload-type';
import { DbConnectionName } from '../db/db.config';
import { PasswordService } from '../password/password.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User, DbConnectionName.READER)
    private readonly readerRepository: Repository<User>,
    @InjectRepository(User, DbConnectionName.EDITOR)
    private readonly editorRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  async create(userData: CreateUserDto): Promise<User> {
    const isUserExists = (await this.findByEmail(userData.email)) !== null;

    if (isUserExists) {
      throw new ConflictException(
        `User with email ${userData.email} already exists`,
      );
    } else {
      const createPayload: UserUpdatePayload = { ...userData };
      const hashedPassword = await this.passwordService.hashPassword(
        userData.password,
      );
      createPayload.passwordHash = hashedPassword;
      delete createPayload.password; // remove plain password so it isn't passed to TypeORM
      const user = this.editorRepository.create(createPayload);

      return this.editorRepository.save(user);
    }
  }

  findAll(): Promise<User[]> {
    return this.readerRepository.find();
  }

  findById(id: number): Promise<User | null> {
    return this.readerRepository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.readerRepository.findOneBy({ email });
  }

  async update(
    id: number,
    dto: UpdateUserDto,
    currentUser: User,
  ): Promise<User | null> {
    const updatePayload: UserUpdatePayload = { ...dto };

    // Prevent users from updating their own role
    if (currentUser.role !== UserRole.ADMIN && dto.role) {
      delete updatePayload.role;
    }

    // Handle password hashing
    if (dto.password) {
      const passwordHash = await this.passwordService.hashPassword(
        dto.password,
      );
      updatePayload.passwordHash = passwordHash;
      delete updatePayload.password; // remove plain password so it isn't passed to TypeORM
    }

    await this.editorRepository.update({ id }, updatePayload);

    return this.findById(id);
  }

  async remove(id: number): Promise<User | null> {
    const user = await this.findById(id);

    if (!user) {
      return null;
    } else {
      await this.editorRepository.delete({ id });
      return user;
    }
  }
}
