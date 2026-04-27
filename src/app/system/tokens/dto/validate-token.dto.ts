import { UserTokenType } from '../tokens.types';

export class ValidateTokenDto {
  type!: UserTokenType;
  token!: string;
}
