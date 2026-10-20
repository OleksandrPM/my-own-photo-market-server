import { TokenPayloads } from '../tokens.payload';
import { TokenType } from '../tokens.types';

export class CreateTokenDto {
  userId: number | null = null;
  type!: TokenType;
  payload: TokenPayloads[TokenType] | null = null;
  deviceId?: string;
  expiresIn!: number; // seconds
}
