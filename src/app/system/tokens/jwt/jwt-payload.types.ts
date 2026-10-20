import { TokenType } from '../tokens.types';

export type AccessJwtPayload = {
  sub: number;
  type: TokenType.ACCESS;
};
