import { Expose } from 'class-transformer';
import { UserResponseDto } from 'src/app/users/dto/user-response.dto';

export class AuthResponseDto {
  @Expose()
  user!: UserResponseDto;

  @Expose()
  accessToken!: string;

  @Expose()
  avatarUrl!: string | null;
}
