import { UserRole } from 'src/app/product/profile/profile.types';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ProfileEntity } from 'src/app/product/profile/entities/profile.entity';

export type AuthResult = {
  response: AuthResponseDto;
  refreshToken: string;
};

export type RefreshResult = {
  accessToken: string;
  refreshToken: string;
};

export interface AuthenticatedUser {
  id: ProfileEntity['id'];
  email: ProfileEntity['email'];
  role: UserRole;
  isVerified: ProfileEntity['isVerified'];
}
