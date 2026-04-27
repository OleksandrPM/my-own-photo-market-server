import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class SetupAdminDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsStrongPassword()
  @MinLength(8)
  password!: string;

  @IsString()
  token!: string;
}
