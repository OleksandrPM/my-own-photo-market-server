import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/roles.decorator';
import { SelfOrAdminGuard } from '../auth/self-or-admin.guard';
import { SelfOnlyGuard } from '../auth/self-only.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Public
  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // Admin
  @Roles(UserRole.ADMIN)
  @Get()
  findAllUsers() {
    return this.usersService.findAll();
  }

  // Admin, user with own email
  @UseGuards(SelfOrAdminGuard)
  @Get('email/:email')
  findUserByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  // Admin, user with own id
  @UseGuards(SelfOrAdminGuard)
  @Get(':id')
  findUserById(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  // User with own id
  @UseGuards(SelfOnlyGuard)
  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    return this.usersService.update(+id, dto, user);
  }

  // Admin
  @Roles(UserRole.ADMIN)
  @Post('admin')
  createAdmin(@Body() dto: CreateUserDto) {
    return this.usersService.create({ ...dto, role: UserRole.ADMIN });
  }

  // Admin
  @Roles(UserRole.ADMIN)
  @Patch('admin/:id/promote')
  promoteToAdmin(@Param('id') id: string, @CurrentUser() user: User) {
    return this.usersService.update(+id, { role: UserRole.ADMIN }, user);
  }
}
