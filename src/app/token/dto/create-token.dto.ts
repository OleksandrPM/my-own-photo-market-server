import { UserTokenType } from '../token.types';

export class CreateTokenDto {
  userId: number;
  type: UserTokenType;
  payload?: Record<string, any>;
  deviceId?: string;
  expiresIn: number; // seconds
}
