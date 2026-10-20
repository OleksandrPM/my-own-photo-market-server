import { TokenOrmEntity } from 'src/app/infrastructure/data/database/tokens/token.orm-entity';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';
import { TokenPayloads } from './tokens.payload';

export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
  INITIAL_SETUP = 'initial_setup',
  EMAIL_CONFIRMATION = 'email_confirmation',
  EMAIL_CHANGE = 'email_change',
  PASSWORD_RESET = 'password_reset',
  TWO_FA = 'two_fa',
}

export type PersistentTokenType = Exclude<TokenType, TokenType.ACCESS>;

export type TypedToken<T extends PersistentTokenType> = Omit<
  TokenOrmEntity,
  'payload' | 'type'
> & {
  type: T;
  payload: TokenPayloads[T];
};

export type AnyTypedToken = {
  [K in PersistentTokenType]: TypedToken<K>;
}[PersistentTokenType];

export enum UniquenessType {
  SINGLE = 'single',
  PER_DEVICE = 'per-device',
  MULTIPLE = 'multiple',
}

export type AccessTokenConfig = {
  ttl: number;
};

export type PersistentTokenConfig = {
  ttl: number;
  uniqueness: UniquenessType;
  requiresDeviceId: boolean;
  requiresSessionId: boolean;
  requiresUserAssociation: boolean;
};

export type TokenConfigMap = {
  [TokenType.ACCESS]: AccessTokenConfig;
} & Record<PersistentTokenType, PersistentTokenConfig>;

export type CreateArgsMap = {
  [TokenType.REFRESH]: {
    type: TokenType.REFRESH;
    userId: UserEntity['id'];
    deviceId: string;
  };
  [TokenType.INITIAL_SETUP]: {
    type: TokenType.INITIAL_SETUP;
    userId: null;
    sessionId: string;
    ownerEmail: string;
  };
  [TokenType.EMAIL_CONFIRMATION]: {
    type: TokenType.EMAIL_CONFIRMATION;
    userId: UserEntity['id'];
  };
  [TokenType.EMAIL_CHANGE]: {
    type: TokenType.EMAIL_CHANGE;
    userId: UserEntity['id'];
    newEmail: string;
  };
  [TokenType.PASSWORD_RESET]: {
    type: TokenType.PASSWORD_RESET;
    userId: UserEntity['id'] | null;
    email: string;
  };
  [TokenType.TWO_FA]: {
    type: TokenType.TWO_FA;
    userId: UserEntity['id'];
    sessionId: string;
  };
};

export type CreateTokenArgs<T extends PersistentTokenType> = CreateArgsMap[T];

export type ValidateArgsMap = {
  [TokenType.REFRESH]: {
    type: TokenType.REFRESH;
    tokenId: number;
    token: string;
    deviceId: string;
  };
  [TokenType.INITIAL_SETUP]: {
    type: TokenType.INITIAL_SETUP;
    tokenId: number;
    token: string;
    sessionId?: string;
    skipSessionCheck?: boolean;
  };
  [TokenType.EMAIL_CONFIRMATION]: {
    type: TokenType.EMAIL_CONFIRMATION;
    tokenId: number;
    token: string;
  };
  [TokenType.EMAIL_CHANGE]: {
    type: TokenType.EMAIL_CHANGE;
    tokenId: number;
    token: string;
  };
  [TokenType.PASSWORD_RESET]: {
    type: TokenType.PASSWORD_RESET;
    tokenId: number;
    token: string;
  };
  [TokenType.TWO_FA]: {
    type: TokenType.TWO_FA;
    tokenId: number;
    token: string;
    sessionId: string;
  };
};

export type ValidateTokenArgs<T extends PersistentTokenType> =
  ValidateArgsMap[T];

export type AnyValidateTokenArgs = ValidateTokenArgs<PersistentTokenType>;

export type ParsedToken = {
  tokenId: number;
  rawToken: string;
};
