import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

// TODO: think about adding fields like termsAccepted, captchaToken, referralCode...

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  username!: string | null;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @IsStrongPassword()
  @MinLength(8)
  password!: string;
}
