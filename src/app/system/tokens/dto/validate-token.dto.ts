import { TokenType } from '../tokens.types';

export class ValidateTokenDto {
  type!: TokenType;
  token!: string;
}
