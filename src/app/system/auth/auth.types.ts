import { ProfileResponseDto } from 'src/app/product/profiles/dto/profile-response.dto';
import { Warning } from 'src/app/common/warning/warning.types';

export type AuthResult = {
  user: ProfileResponseDto;
  accessToken: string;
  refreshToken: string;
  deviceId: string;

  warning?: Warning;
};

export type RefreshResult = {
  accessToken: string;
  refreshToken: string;
};
