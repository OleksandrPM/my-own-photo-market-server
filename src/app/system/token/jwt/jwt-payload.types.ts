import { TokenType } from '../token.types';

export type AccessJwtPayload = {
  sub: number;
  type: TokenType.ACCESS;
};
