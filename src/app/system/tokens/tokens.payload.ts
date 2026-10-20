import { TokenType } from './tokens.types';

export type TokenPayloads = {
  [TokenType.ACCESS]: null;
  [TokenType.REFRESH]: null;
  [TokenType.INITIAL_SETUP]: {
    ownerEmail: string;
    isConfirmed: boolean;
  };
  [TokenType.EMAIL_CONFIRMATION]: {
    email: string;
  };
  [TokenType.EMAIL_CHANGE]: {
    oldEmail: string;
    newEmail: string;
  };
  [TokenType.PASSWORD_RESET]: {
    email: string;
  };
  [TokenType.TWO_FA]: null;
};

export type UserTokenPayload = TokenPayloads[TokenType];

export type TokenPayloadInputs = {
  [TokenType.ACCESS]: {};
  [TokenType.REFRESH]: {};
  [TokenType.INITIAL_SETUP]: {
    ownerEmail: string;
  };
  [TokenType.EMAIL_CONFIRMATION]: {
    email: string;
  };
  [TokenType.EMAIL_CHANGE]: {
    oldEmail: string;
    newEmail: string;
  };
  [TokenType.PASSWORD_RESET]: {
    email: string;
  };
  [TokenType.TWO_FA]: {};
};

type PayloadBuilders = {
  [K in TokenType]: (input: TokenPayloadInputs[K]) => TokenPayloads[K];
};

export const PAYLOAD_BUILDERS: PayloadBuilders = {
  [TokenType.ACCESS]: () => null,
  [TokenType.REFRESH]: () => null,
  [TokenType.INITIAL_SETUP]: ({ ownerEmail }) => ({
    ownerEmail,
    isConfirmed: false,
  }),
  [TokenType.EMAIL_CONFIRMATION]: ({ email }) => ({
    email,
  }),
  [TokenType.EMAIL_CHANGE]: ({ oldEmail, newEmail }) => ({
    oldEmail,
    newEmail,
  }),
  [TokenType.PASSWORD_RESET]: ({ email }) => ({
    email,
  }),
  [TokenType.TWO_FA]: () => null,
};

export function buildTokenPayload<T extends TokenType>(
  type: T,
  input: TokenPayloadInputs[T],
): TokenPayloads[T] {
  return PAYLOAD_BUILDERS[type](input);
}
