import { UserTokenOrmEntity } from 'src/app/infrastructure/data/database/user-tokens/user-token.orm-entity';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';
import { TokenPayloads } from './tokens.payload';

export enum UserTokenType {
  INITIAL_SETUP = 'initial_setup',
  EMAIL_CONFIRMATION = 'email_confirmation',
  EMAIL_CHANGE = 'email_change',
  PASSWORD_RESET = 'password_reset',
  REFRESH = 'refresh',
  TWO_FA = 'two_fa',
}

export type TypedUserToken<T extends UserTokenType> = Omit<
  UserTokenOrmEntity,
  'payload' | 'type'
> & {
  type: T;
  payload: TokenPayloads[T];
};

export type AnyTypedUserToken = {
  [K in UserTokenType]: TypedUserToken<K>;
}[UserTokenType];

export const asTypedToken = <T extends UserTokenType>(
  token: UserTokenOrmEntity | null,
  type: T,
): TypedUserToken<T> | null => {
  if (!token) return null;
  if (token.type !== type) return null;
  return token as unknown as TypedUserToken<T>;
};

export enum UniquenessType {
  SINGLE = 'single',
  PER_DEVICE = 'per-device',
  MULTIPLE = 'multiple',
}

export const TOKEN_UNIQUENESS: Record<UserTokenType, UniquenessType> = {
  [UserTokenType.INITIAL_SETUP]: UniquenessType.SINGLE,
  [UserTokenType.EMAIL_CONFIRMATION]: UniquenessType.SINGLE,
  [UserTokenType.EMAIL_CHANGE]: UniquenessType.SINGLE,
  [UserTokenType.PASSWORD_RESET]: UniquenessType.SINGLE,
  [UserTokenType.TWO_FA]: UniquenessType.SINGLE,
  [UserTokenType.REFRESH]: UniquenessType.PER_DEVICE,
};

export type CreateArgsMap = {
  [UserTokenType.INITIAL_SETUP]: {
    type: UserTokenType.INITIAL_SETUP;
    user: null;
    sessionId: string;
    ownerEmail: string;
  };
  [UserTokenType.EMAIL_CONFIRMATION]: {
    type: UserTokenType.EMAIL_CONFIRMATION;
    user: UserEntity;
  };
  [UserTokenType.EMAIL_CHANGE]: {
    type: UserTokenType.EMAIL_CHANGE;
    user: UserEntity;
    newEmail: string;
  };
  [UserTokenType.PASSWORD_RESET]: {
    type: UserTokenType.PASSWORD_RESET;
    user: UserEntity | null;
    email: string;
  };
  [UserTokenType.REFRESH]: {
    type: UserTokenType.REFRESH;
    user: UserEntity;
    deviceId: string;
    sessionId: string;
  };
  [UserTokenType.TWO_FA]: {
    type: UserTokenType.TWO_FA;
    user: UserEntity;
    sessionId: string;
  };
};

export type CreateTokenArgs<T extends UserTokenType> = CreateArgsMap[T];

export type ValidateArgsMap = {
  [UserTokenType.INITIAL_SETUP]: {
    type: UserTokenType.INITIAL_SETUP;
    tokenId: number;
    token: string;
    sessionId?: string;
    skipSessionCheck?: boolean;
  };
  [UserTokenType.EMAIL_CONFIRMATION]: {
    type: UserTokenType.EMAIL_CONFIRMATION;
    tokenId: number;
    token: string;
  };
  [UserTokenType.EMAIL_CHANGE]: {
    type: UserTokenType.EMAIL_CHANGE;
    tokenId: number;
    token: string;
  };
  [UserTokenType.PASSWORD_RESET]: {
    type: UserTokenType.PASSWORD_RESET;
    tokenId: number;
    token: string;
  };
  [UserTokenType.REFRESH]: {
    type: UserTokenType.REFRESH;
    tokenId: number;
    token: string;
    deviceId: string;
    sessionId: string;
  };
  [UserTokenType.TWO_FA]: {
    type: UserTokenType.TWO_FA;
    tokenId: number;
    token: string;
    sessionId: string;
  };
};

export type ValidateTokenArgs<T extends UserTokenType> = ValidateArgsMap[T];

export type AnyValidateTokenArgs = ValidateArgsMap[UserTokenType];

export type ParsedToken = {
  tokenId: number;
  rawToken: string;
};
