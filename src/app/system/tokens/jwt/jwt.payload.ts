import { TokenPayloads } from '../tokens.payload';
import { UserTokenType } from '../tokens.types';

export interface JwtPayloadBase {
  userId: number | null;
  tokenId: number;
  tokenType: UserTokenType;
}

export type JwtPayloads = {
  [K in UserTokenType]: JwtPayloadBase & {
    type: K;
    payload: TokenPayloads[K];
  };
};

export type UserJwtPayload = JwtPayloads[UserTokenType];
