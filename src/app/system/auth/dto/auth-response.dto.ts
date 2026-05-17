import { ProfileResponseDto } from 'src/app/product/profiles/dto/profile-response.dto';
import type { Warning } from 'src/app/common/warning';

export class AuthResponseDto {
  user!: ProfileResponseDto;
  accessToken!: string;
  warnings?: Warning[];
}
