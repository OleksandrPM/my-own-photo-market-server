import { TokenPayloads } from '../token.payload';
import { TokenType } from '../token.types';

export class CreateTokenDto {
  userId: number | null = null;
  type!: TokenType;
  payload: TokenPayloads[TokenType] | null = null;
  deviceId?: string;
  expiresIn!: number; // seconds
}
