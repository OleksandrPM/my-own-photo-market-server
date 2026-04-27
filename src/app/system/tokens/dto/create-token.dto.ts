import { TokenPayloads } from '../tokens.payload';
import { UserTokenType } from '../tokens.types';

export class CreateTokenDto {
  userId: number | null = null;
  type!: UserTokenType;
  payload: TokenPayloads[UserTokenType] | null = null;
  deviceId?: string;
  expiresIn!: number; // seconds
}
