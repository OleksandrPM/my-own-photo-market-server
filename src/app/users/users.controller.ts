import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { UsersService } from './users.service';
import { UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/roles.decorator';
import { SelfOrAdminGuard } from '../auth/self-or-admin.guard';
import { SelfOnlyGuard } from '../auth/self-only.guard';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Public
  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async createUser(
    @UploadedFile() avatar: Express.Multer.File | undefined,
    @Body() dto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.createUser(dto, avatar);

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  // Admin
  @Roles(UserRole.ADMIN)
  @Get()
  async findAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();

    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  // Admin or user with own email
  @UseGuards(SelfOrAdminGuard)
  @Get('email/:email')
  async findUserByEmail(
    @Param('email') email: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findByEmail(email);

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  // Admin or user with own id
  @UseGuards(SelfOrAdminGuard)
  @Get('id/:id')
  async findUserById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(+id);

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  // User with own id
  @UseGuards(SelfOnlyGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUser(
    @UploadedFile() avatar: Express.Multer.File | undefined,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(+id, dto, avatar);

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  // Admin
  @Roles(UserRole.ADMIN)
  @Post('admin')
  async createAdmin(@Body() dto: CreateAdminDto): Promise<UserResponseDto> {
    const user = await this.usersService.createAdmin(dto);

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  // Admin
  @Roles(UserRole.ADMIN)
  @Patch('admin/:id/promote')
  async promoteToAdmin(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.promote(+id);

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
