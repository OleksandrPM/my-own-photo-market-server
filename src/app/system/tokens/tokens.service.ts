import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IsNull } from 'typeorm';

import {
  CreateTokenArgs,
  TypedToken,
  TokenType,
  PersistentTokenType,
  ValidateTokenArgs,
} from './tokens.types';
import { buildTokenPayload, UserTokenPayload } from './tokens.payload';
import {
  generateRandomToken,
  hashToken,
  verifyTokenHash,
} from './tokens.utils';

import { TokensRepository } from 'src/app/infrastructure/data/database/tokens/tokens.repository';
import { TokenWhere } from 'src/app/infrastructure/data/database/tokens/tokens-data.types';
import { TokenOrmEntity } from 'src/app/infrastructure/data/database/tokens/token.orm-entity';
import { TOKEN_CONFIG } from './tokens.config';

@Injectable()
export class TokenService {
  constructor(private readonly tokensRepository: TokensRepository) {}

  // ---------------- Helpers ----------------

  private requiresDeviceId(type: PersistentTokenType): boolean {
    return TOKEN_CONFIG[type].requiresDeviceId;
  }

  private requiresSessionId(type: PersistentTokenType): boolean {
    return TOKEN_CONFIG[type].requiresSessionId;
  }

  private buildRevokeWhereForCreate<T extends PersistentTokenType>(
    args: CreateTokenArgs<T>,
  ): TokenWhere {
    switch (args.type) {
      case TokenType.INITIAL_SETUP:
        return {
          type: args.type,
          sessionId: args.sessionId,
          revokedAt: IsNull(),
        };

      case TokenType.REFRESH:
        return {
          type: args.type,
          userId: args.userId,
          deviceId: args.deviceId,
          revokedAt: IsNull(),
        };

      // SINGLE user-bound tokens
      case TokenType.PASSWORD_RESET:
        return {
          type: args.type,
          userId: args.userId === null ? IsNull() : args.userId,
          revokedAt: IsNull(),
        };

      case TokenType.EMAIL_CONFIRMATION:
      case TokenType.EMAIL_CHANGE:
      case TokenType.TWO_FA:
        return {
          type: args.type,
          userId: args.userId,
          revokedAt: IsNull(),
        };

      default: {
        const exhaustive: never = args;
        throw new Error(`Unsupported token type: ${exhaustive}`);
      }
    }
  }

  private async revokeExistingTokensForCreate<T extends PersistentTokenType>(
    args: CreateTokenArgs<T>,
  ) {
    const where = this.buildRevokeWhereForCreate(args);
    await this.tokensRepository.revokeWhere(where, new Date());
  }

  private toTypedToken<T extends PersistentTokenType>(
    token: TokenOrmEntity,
  ): TypedToken<T> {
    return token as TypedToken<T>;
  }

  // ---------------- Public API ----------------

  async createToken<T extends PersistentTokenType>(
    args: CreateTokenArgs<T>,
  ): Promise<{
    id: number;
    rawToken: string;
    expiresAt: Date;
    record: TypedToken<T>;
  }> {
    const type = args.type;

    // revoke previous by scope
    await this.revokeExistingTokensForCreate(args);

    // 2) secret + hash
    const rawToken = generateRandomToken();
    const tokenHash = await hashToken(rawToken);

    // 3) build payload
    const payload = buildTokenPayload(type, args);

    // 4) entity fields
    const deviceId = 'deviceId' in args ? args.deviceId : null;
    const sessionId = 'sessionId' in args ? args.sessionId : null;
    const expiresAt = new Date(Date.now() + TOKEN_CONFIG[type].ttl);

    const record = this.tokensRepository.create({
      userId: args.userId,
      type,
      tokenHash,
      payload,
      deviceId,
      sessionId,
      expiresAt,
    });

    const saved = await this.tokensRepository.save(record);

    return {
      id: saved.id,
      rawToken,
      expiresAt: saved.expiresAt,
      record: this.toTypedToken<T>(saved),
    };
  }

  async validateToken<T extends PersistentTokenType>(
    args: ValidateTokenArgs<T>,
  ): Promise<TypedToken<T>> {
    const now = new Date();

    const record = await this.tokensRepository.findById(args.tokenId);

    if (!record) {
      throw new UnauthorizedException('Invalid token');
    }

    if (record.type !== args.type) {
      throw new UnauthorizedException('Invalid token type');
    }

    if (record.revokedAt) {
      throw new UnauthorizedException('Token revoked');
    }

    if (record.expiresAt < now) {
      throw new UnauthorizedException('Token expired');
    }

    const ok = await verifyTokenHash(record.tokenHash, args.token);

    if (!ok) {
      throw new UnauthorizedException('Invalid token');
    }

    if (this.requiresDeviceId(args.type)) {
      if (!('deviceId' in args) || !args.deviceId) {
        throw new UnauthorizedException('DeviceId is required');
      }

      if (!record.deviceId || record.deviceId !== args.deviceId) {
        throw new UnauthorizedException('Device mismatch');
      }
    }

    if (
      this.requiresSessionId(args.type) &&
      !('skipSessionCheck' in args && args.skipSessionCheck)
    ) {
      if (!('sessionId' in args) || !args.sessionId) {
        throw new UnauthorizedException('SessionId is required');
      }

      if (!record.sessionId || record.sessionId !== args.sessionId) {
        throw new UnauthorizedException('Session mismatch');
      }
    }

    if (args.type === TokenType.INITIAL_SETUP) {
      if (record.userId !== null) {
        throw new UnauthorizedException(
          'INITIAL_SETUP token must not be associated with a user',
        );
      }
    } else {
      if (record.userId === null) {
        throw new UnauthorizedException('Token is not associated with a user');
      }
    }

    return this.toTypedToken<T>(record);
  }

  async revokeTokenById(id: number, date = new Date()) {
    await this.tokensRepository.revokeById(id, date);
  }

  async revokeTokensByType(tokenType: PersistentTokenType, date = new Date()) {
    return this.tokensRepository.revokeWhere({ type: tokenType }, date);
  }

  // update payload helpers
  async updateTokenPayload(id: number, payload: UserTokenPayload | null) {
    await this.tokensRepository.updatePayloadById(id, payload);
  }

  async mergeTokenPayload(id: number, payloadPatch: Record<string, unknown>) {
    await this.tokensRepository.mergePayloadById(id, payloadPatch);
  }
}
