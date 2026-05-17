import { Warning } from 'src/app/common/warning';
import { ProfileResponseDto } from 'src/app/product/profiles/dto/profile-response.dto';

export class VerifyEmailResponseDto {
  user!: ProfileResponseDto;
  warnings?: Warning[];
}
