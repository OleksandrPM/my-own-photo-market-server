import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateProfileDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  username?: string | null;

  @IsString()
  @MinLength(8)
  password!: string;
}
