import { UserTokenType } from '../token.types';

export class ValidateTokenDto {
  type!: UserTokenType;
  token!: string;
}
