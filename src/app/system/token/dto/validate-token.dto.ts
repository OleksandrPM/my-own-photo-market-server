import { TokenType } from '../token.types';

export class ValidateTokenDto {
  type!: TokenType;
  token!: string;
}
