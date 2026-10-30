import { Warning } from 'src/app/common/warning';
import { ProfileResponseDto } from 'src/app/product/profile/dto/profile-response.dto';

export class VerifyEmailResponseDto {
  profile!: ProfileResponseDto;
  warnings?: Warning[];
}
