import { UserToken } from './entities/user-token.entity';
import { TokenPayloadInputs, TokenPayloads } from './tokens.payload';

export enum UserTokenType {
  INITIAL_SETUP = 'initial_setup',
  EMAIL_CONFIRMATION = 'email_confirmation',
  EMAIL_CHANGE = 'email_change',
  PASSWORD_RESET = 'password_reset',
  REFRESH = 'refresh',
  TWO_FA = 'two_fa',
}

export type TypedUserToken<T extends UserTokenType> = Omit<
  UserToken,
  'payload' | 'type'
> & {
  type: T;
  payload: TokenPayloads[T];
};

export type AnyTypedUserToken = {
  [K in UserTokenType]: TypedUserToken<K>;
}[UserTokenType];

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

// Args types for createToken
export type ExtraArg<T extends UserTokenType> =
  TokenPayloadInputs[T]['extra'] extends null
    ? { extra?: null } // можна не передавати
    : { extra: TokenPayloadInputs[T]['extra'] }; // обов’язково

export type UserArg<T extends UserTokenType> =
  TokenPayloadInputs[T]['user'] extends null
    ? { user: null }
    : { user: TokenPayloadInputs[T]['user'] };

export type DeviceArg<T extends UserTokenType> =
  (typeof TOKEN_UNIQUENESS)[T] extends UniquenessType.PER_DEVICE
    ? { deviceId: string } // обов’язково
    : { deviceId?: string };

export type CreateTokenArgs<T extends UserTokenType> = {
  type: T;
} & UserArg<T> &
  ExtraArg<T> &
  DeviceArg<T>;
