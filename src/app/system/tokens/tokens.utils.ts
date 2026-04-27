import * as crypto from 'crypto';
import * as argon2 from 'argon2';

export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function hashToken(token: string): Promise<string> {
  return argon2.hash(token);
}

export async function verifyTokenHash(
  token: string,
  hash: string,
): Promise<boolean> {
  return argon2.verify(hash, token);
}
