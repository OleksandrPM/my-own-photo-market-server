import { toMs } from 'src/app/common/utils';
import { TokenConfigMap, TokenType, UniquenessType } from './tokens.types';

export const TOKEN_CONFIG: TokenConfigMap = {
  [TokenType.ACCESS]: {
    ttl: toMs.minutes(15),
  },
  [TokenType.REFRESH]: {
    ttl: toMs.days(30),
    uniqueness: UniquenessType.PER_DEVICE,
    requiresDeviceId: true,
    requiresSessionId: true,
    requiresUserAssociation: true,
  },

  [TokenType.INITIAL_SETUP]: {
    ttl: toMs.minutes(15),
    uniqueness: UniquenessType.SINGLE,
    requiresDeviceId: false,
    requiresSessionId: true,
    requiresUserAssociation: false,
  },

  [TokenType.EMAIL_CONFIRMATION]: {
    ttl: toMs.minutes(15),
    uniqueness: UniquenessType.SINGLE,
    requiresDeviceId: false,
    requiresSessionId: false,
    requiresUserAssociation: true,
  },

  [TokenType.EMAIL_CHANGE]: {
    ttl: toMs.minutes(15),
    uniqueness: UniquenessType.SINGLE,
    requiresDeviceId: false,
    requiresSessionId: false,
    requiresUserAssociation: true,
  },

  [TokenType.PASSWORD_RESET]: {
    ttl: toMs.minutes(15),
    uniqueness: UniquenessType.SINGLE,
    requiresDeviceId: false,
    requiresSessionId: false,
    requiresUserAssociation: true,
  },

  [TokenType.TWO_FA]: {
    ttl: toMs.minutes(5),
    uniqueness: UniquenessType.SINGLE,
    requiresDeviceId: false,
    requiresSessionId: true,
    requiresUserAssociation: true,
  },
};
