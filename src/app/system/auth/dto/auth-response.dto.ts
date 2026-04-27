import { Expose } from 'class-transformer';
import { ProfileResponseDto } from 'src/app/product/profiles/dto/profile-response.dto';

export class AuthResponseDto {
  @Expose()
  user!: ProfileResponseDto;

  @Expose()
  accessToken!: string;
}
