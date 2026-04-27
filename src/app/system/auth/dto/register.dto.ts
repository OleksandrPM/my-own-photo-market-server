import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

// TODO: think about adding fields like termsAccepted, captchaToken, referralCode...

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  username!: string | null;

  @IsString()
  @IsStrongPassword()
  @MinLength(8)
  password!: string;
}
