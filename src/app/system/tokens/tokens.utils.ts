import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import { ParsedToken } from './tokens.types';

export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function hashToken(token: string): Promise<string> {
  return argon2.hash(token);
}

export async function verifyTokenHash(
  hash: string,
  token: string,
): Promise<boolean> {
  return argon2.verify(hash, token);
}

export function encodeToken(
  tokenId: ParsedToken['tokenId'],
  rawToken: ParsedToken['rawToken'],
): string {
  if (!Number.isInteger(tokenId) || tokenId <= 0) {
    throw new Error('Invalid tokenId');
  }

  if (!rawToken || rawToken.includes('.')) {
    throw new Error('Invalid rawToken');
  }

  return `${tokenId}.${rawToken}`;
}

export function decodeToken(token: string): ParsedToken {
  if (!token || typeof token !== 'string') {
    throw new Error('Token is required');
  }

  const parts = token.split('.');

  if (parts.length !== 2) {
    throw new Error('Invalid token format');
  }

  const [idStr, rawToken] = parts;
  const tokenId = Number(idStr);

  if (!Number.isInteger(tokenId) || tokenId <= 0) {
    throw new Error('Invalid tokenId');
  }

  if (!rawToken) {
    throw new Error('Invalid raw token');
  }

  return { tokenId, rawToken };
}
