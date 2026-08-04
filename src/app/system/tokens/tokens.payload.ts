import { UserEntity } from 'src/app/product/profiles/entities/user.entity';
import { UserTokenType } from './tokens.types';

export type TokenPayloads = {
  [UserTokenType.INITIAL_SETUP]: {
    ownerEmail: string;
    isConfirmed: boolean;
  };
  [UserTokenType.EMAIL_CONFIRMATION]: {
    email: string;
  };
  [UserTokenType.EMAIL_CHANGE]: {
    oldEmail: string;
    newEmail: string;
  };
  [UserTokenType.PASSWORD_RESET]: {
    email: string;
  };
  [UserTokenType.REFRESH]: null;
  [UserTokenType.TWO_FA]: null;
};

export type UserTokenPayload = TokenPayloads[UserTokenType];

export type TokenPayloadInputs = {
  [UserTokenType.INITIAL_SETUP]: {
    user: null;
    ownerEmail: string;
  };
  [UserTokenType.EMAIL_CONFIRMATION]: {
    user: UserEntity;
  };
  [UserTokenType.EMAIL_CHANGE]: {
    user: UserEntity;
    newEmail: string;
  };
  [UserTokenType.PASSWORD_RESET]: {
    user: UserEntity | null;
    email: string;
  };
  [UserTokenType.REFRESH]: {
    user: UserEntity;
  };
  [UserTokenType.TWO_FA]: {
    user: UserEntity;
  };
};

type PayloadBuilders = {
  [K in UserTokenType]: (input: TokenPayloadInputs[K]) => TokenPayloads[K];
};

export const PAYLOAD_BUILDERS: PayloadBuilders = {
  [UserTokenType.INITIAL_SETUP]: (i) => ({
    ownerEmail: i.ownerEmail,
    isConfirmed: false,
  }),
  [UserTokenType.EMAIL_CONFIRMATION]: (i) => ({
    email: i.user.email,
  }),
  [UserTokenType.EMAIL_CHANGE]: (i) => ({
    oldEmail: i.user.email,
    newEmail: i.newEmail,
  }),
  [UserTokenType.PASSWORD_RESET]: (i) => ({
    email: i.email ?? i.user?.email ?? '',
  }),
  [UserTokenType.REFRESH]: (_i) => null,
  [UserTokenType.TWO_FA]: (_i) => null,
};

export function buildTokenPayload<T extends UserTokenType>(
  type: T,
  input: TokenPayloadInputs[T],
): TokenPayloads[T] {
  return PAYLOAD_BUILDERS[type](input);
}
