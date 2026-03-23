import { UserTokenType } from './token.types';
import { User } from '../users/entities/user.entity';

export type TokenPayloadBuilder =
  | ((user: User, extra?: any) => Record<string, any>)
  | null;

export const TOKEN_PAYLOAD: Record<UserTokenType, TokenPayloadBuilder> = {
  [UserTokenType.REFRESH]: null,
  [UserTokenType.PASSWORD_RESET]: null,
  [UserTokenType.TWO_FA]: null,

  [UserTokenType.EMAIL_CONFIRMATION]: (user) => ({
    email: user.email,
  }),

  [UserTokenType.EMAIL_CHANGE]: (_, extra) => ({
    newEmail: extra?.newEmail,
  }),
};
