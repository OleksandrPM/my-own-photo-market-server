import { UserTokenType } from './tokens.types';

export const TOKEN_TTL: Record<UserTokenType, number> = {
  [UserTokenType.REFRESH]: 30 * 24 * 60 * 60 * 1000, // 30 days
  [UserTokenType.EMAIL_CONFIRMATION]: 15 * 60 * 1000, // 15 minutes
  [UserTokenType.PASSWORD_RESET]: 15 * 60 * 1000, // 15 minutes
  [UserTokenType.EMAIL_CHANGE]: 15 * 60 * 1000, // 15 minutes
  [UserTokenType.TWO_FA]: 5 * 60 * 1000, // 5 minutes
  [UserTokenType.INITIAL_SETUP]: 15 * 60 * 1000, // 15 minutes
};
