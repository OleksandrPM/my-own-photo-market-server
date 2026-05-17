import { Warning } from 'src/app/common/warning';
import { ProfileResponseDto } from 'src/app/product/profiles/dto/profile-response.dto';

export class MeResponseDto {
  user!: ProfileResponseDto;
  warnings?: Warning[];
}
