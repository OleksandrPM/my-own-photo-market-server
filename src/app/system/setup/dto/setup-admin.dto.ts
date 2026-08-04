import { IsString, IsStrongPassword, MinLength } from 'class-validator';

export class SetupAdminDto {
  @IsString()
  @IsStrongPassword()
  @MinLength(8)
  password!: string;
}
