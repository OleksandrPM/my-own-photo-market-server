import { TokenOrmEntity } from 'src/app/infrastructure/data/database/tokens/token.orm-entity';
import { TypedToken, PersistentTokenType } from './tokens.types';

export function isTypedToken<T extends PersistentTokenType>(
  token: TokenOrmEntity,
  type: T,
): token is TypedToken<T> {
  return token.type === type;
}

export function asTypedToken<T extends PersistentTokenType>(
  token: TokenOrmEntity | null,
  type: T,
): TypedToken<T> | null {
  if (!token) {
    return null;
  }

  if (!isTypedToken(token, type)) {
    return null;
  }

  return token;
}

export function assertTypedToken<T extends PersistentTokenType>(
  token: TokenOrmEntity,
  type: T,
): asserts token is TypedToken<T> {
  if (!isTypedToken(token, type)) {
    throw new Error(`Expected token type "${type}", got "${token.type}"`);
  }
}
