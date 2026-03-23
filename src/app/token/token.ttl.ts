import { UserTokenType } from './token.types';

export const TOKEN_TTL: Record<UserTokenType, number> = {
  [UserTokenType.REFRESH]: 60 * 60 * 24 * 30, // 30 days
  [UserTokenType.EMAIL_CONFIRMATION]: 15 * 60, // 15 minutes
  [UserTokenType.PASSWORD_RESET]: 15 * 60, // 15 minutes
  [UserTokenType.EMAIL_CHANGE]: 15 * 60, // 15 minutes
  [UserTokenType.TWO_FA]: 5 * 60, // 5 minutes
};
