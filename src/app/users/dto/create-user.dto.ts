import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

// TODO: Think about adding fields like emailVerified etc.

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsString()
  @MinLength(8)
  password: string;
}
