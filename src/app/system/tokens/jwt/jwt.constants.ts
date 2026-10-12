import { UserTokenType } from '../tokens.types';

export enum JwtSecretGroup {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
  ACTION = 'ACTION',
}

export const TOKEN_SECRET_GROUP: Record<UserTokenType, JwtSecretGroup> = {
  [UserTokenType.ACCESS]: JwtSecretGroup.ACCESS,
  [UserTokenType.REFRESH]: JwtSecretGroup.REFRESH,

  [UserTokenType.EMAIL_CONFIRMATION]: JwtSecretGroup.ACTION,
  [UserTokenType.PASSWORD_RESET]: JwtSecretGroup.ACTION,
  [UserTokenType.EMAIL_CHANGE]: JwtSecretGroup.ACTION,
  [UserTokenType.TWO_FA]: JwtSecretGroup.ACTION,
  [UserTokenType.INITIAL_SETUP]: JwtSecretGroup.ACTION,
};

export const JWT_SECRET_ENV: Record<
  JwtSecretGroup,
  string
> = {
  [JwtSecretGroup.ACCESS]: 'JWT_ACCESS_SECRET',
  [JwtSecretGroup.REFRESH]: 'JWT_REFRESH_SECRET',
  [JwtSecretGroup.ACTION]: 'JWT_ACTION_SECRET',
};