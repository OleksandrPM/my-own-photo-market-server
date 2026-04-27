import { IsEmail } from 'class-validator';

export class SetupVerifyEmailDto {
  @IsEmail()
  email!: string;
}
