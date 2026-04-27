import { UserEntity } from 'src/app/product/profiles/entities/user.entity';
import { UserTokenType } from './tokens.types';

export type TokenPayloadInputs = {
  [UserTokenType.INITIAL_SETUP]: { user: null; extra: { ownerEmail: string } };
  [UserTokenType.EMAIL_CONFIRMATION]: { user: UserEntity; extra: null };
  [UserTokenType.EMAIL_CHANGE]: {
    user: UserEntity;
    extra: { newEmail: string };
  };
  [UserTokenType.REFRESH]: { user: UserEntity; extra: null };
  [UserTokenType.PASSWORD_RESET]: { user: UserEntity; extra: null };
  [UserTokenType.TWO_FA]: { user: UserEntity; extra: null };
};

export type TokenPayloads = {
  [UserTokenType.INITIAL_SETUP]: { ownerEmail: string; isConfirmed: boolean };
  [UserTokenType.EMAIL_CONFIRMATION]: { email: string };
  [UserTokenType.EMAIL_CHANGE]: { oldEmail: string; newEmail: string };
  [UserTokenType.REFRESH]: null;
  [UserTokenType.PASSWORD_RESET]: null;
  [UserTokenType.TWO_FA]: null;
};

export type UserTokenPayload = TokenPayloads[UserTokenType];

/** 3) Тип builders тепер можна визначити без циклу */
type TokenPayloadBuilderMap = {
  [K in UserTokenType]: TokenPayloads[K] extends null
    ? null
    : (input: TokenPayloadInputs[K]) => TokenPayloads[K];
};

/** 4) Builders перевіряємо через satisfies */
export const TOKEN_PAYLOAD_BUILDERS = {
  [UserTokenType.INITIAL_SETUP]: ({ extra }) => ({
    ownerEmail: extra.ownerEmail,
    isConfirmed: false,
  }),

  [UserTokenType.EMAIL_CONFIRMATION]: ({ user }) => ({
    email: user.email,
  }),

  [UserTokenType.EMAIL_CHANGE]: ({ user, extra }) => ({
    oldEmail: user.email,
    newEmail: extra.newEmail,
  }),

  [UserTokenType.REFRESH]: null,
  [UserTokenType.PASSWORD_RESET]: null,
  [UserTokenType.TWO_FA]: null,
} satisfies TokenPayloadBuilderMap;

export function buildTokenPayload<T extends UserTokenType>(
  type: T,
  input: TokenPayloadInputs[T],
): TokenPayloads[T] {
  const builder = TOKEN_PAYLOAD_BUILDERS[type];

  // TS не завжди вміє зв'язати conditional-return, тому тут допустимий контрольований cast
  return (builder ? (builder as any)(input) : null) as TokenPayloads[T];
}
