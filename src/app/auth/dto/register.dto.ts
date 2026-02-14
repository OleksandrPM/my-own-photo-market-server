import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

// TODO: think about adding fields like termsAccepted, captchaToken, referralCode...

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsString()
  @MinLength(8)
  password: string;
}
