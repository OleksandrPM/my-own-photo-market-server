import { toMs } from 'src/app/common/utils/ms-converter';
import { UserTokenType } from './tokens.types';

export const TOKEN_TTL: Record<UserTokenType, number> = {
  [UserTokenType.ACCESS]: toMs.minutes(15),
  [UserTokenType.REFRESH]: toMs.days(30),
  [UserTokenType.EMAIL_CONFIRMATION]: toMs.minutes(15),
  [UserTokenType.PASSWORD_RESET]: toMs.minutes(15),
  [UserTokenType.EMAIL_CHANGE]: toMs.minutes(15),
  [UserTokenType.TWO_FA]: toMs.minutes(5),
  [UserTokenType.INITIAL_SETUP]: toMs.minutes(15),
};
