import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  role: UserRole;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
