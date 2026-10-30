import { TokenOrmEntity } from 'src/app/infrastructure/data/database/tokens/token.orm-entity';
import { ProfileEntity } from 'src/app/product/profile/entities/profile.entity';
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

export type ValidatedToken<T extends PersistentTokenType> =
  T extends TokenType.INITIAL_SETUP
    ? TypedToken<T>
    : Omit<TypedToken<T>, 'userId'> & {
        userId: number;
      };

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
    userId: ProfileEntity['id'];
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
    userId: ProfileEntity['id'];
  };

  [TokenType.EMAIL_CHANGE]: {
    type: TokenType.EMAIL_CHANGE;
    userId: ProfileEntity['id'];
    newEmail: string;
  };

  [TokenType.PASSWORD_RESET]: {
    type: TokenType.PASSWORD_RESET;
    userId: ProfileEntity['id'];
    email: string;
  };

  [TokenType.TWO_FA]: {
    type: TokenType.TWO_FA;
    userId: ProfileEntity['id'];
    deviceId: string;
  };
};

export type CreateTokenArgs<T extends PersistentTokenType> = CreateArgsMap[T];

export type ValidateArgsMap = {
  [TokenType.REFRESH]: {
    type: TokenType.REFRESH;
    encodedToken: string;
    deviceId: string;
  };

  [TokenType.INITIAL_SETUP]: {
    type: TokenType.INITIAL_SETUP;
    encodedToken: string;
    sessionId?: string;
    skipSessionCheck?: boolean;
  };

  [TokenType.EMAIL_CONFIRMATION]: {
    type: TokenType.EMAIL_CONFIRMATION;
    encodedToken: string;
  };

  [TokenType.EMAIL_CHANGE]: {
    type: TokenType.EMAIL_CHANGE;
    encodedToken: string;
  };

  [TokenType.PASSWORD_RESET]: {
    type: TokenType.PASSWORD_RESET;
    encodedToken: string;
  };

  [TokenType.TWO_FA]: {
    type: TokenType.TWO_FA;
    encodedToken: string;
    deviceId: string;
  };
};

export type ValidateTokenArgs<T extends PersistentTokenType> =
  ValidateArgsMap[T];

export type ParsedToken = {
  tokenId: number;
  rawToken: string;
};
