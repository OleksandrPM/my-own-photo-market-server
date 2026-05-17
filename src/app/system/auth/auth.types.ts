import { AuthResponseDto } from './dto/auth-response.dto';

export type AuthResult = {
  response: AuthResponseDto;
  refreshToken: string;
  deviceId: string;
};

export type RefreshResult = {
  accessToken: string;
  refreshToken: string;
};
