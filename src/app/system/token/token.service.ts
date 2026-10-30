import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IsNull } from 'typeorm';

import {
  CreateTokenArgs,
  TypedToken,
  TokenType,
  PersistentTokenType,
  ValidateTokenArgs,
  ValidatedToken,
} from './token.types';
import { buildTokenPayload, TokenPayload } from './token.payload';
import {
  decodeToken,
  encodeToken,
  generateRandomToken,
  hashToken,
  verifyTokenHash,
} from './token.utils';

import { TokensRepository } from 'src/app/infrastructure/data/database/tokens/tokens.repository';
import { TokenWhere } from 'src/app/infrastructure/data/database/tokens/tokens-data.types';
import { TokenOrmEntity } from 'src/app/infrastructure/data/database/tokens/token.orm-entity';
import { TOKEN_CONFIG } from './token.config';

@Injectable()
export class TokenService {
  constructor(private readonly tokensRepository: TokensRepository) {}

  // Create helpers

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

      case TokenType.PASSWORD_RESET:
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

        throw new Error(
          `Unsupported token type: ${JSON.stringify(exhaustive)}`,
        );
      }
    }
  }

  private async revokeExistingTokensForCreate<T extends PersistentTokenType>(
    args: CreateTokenArgs<T>,
  ): Promise<void> {
    await this.tokensRepository.revokeWhere(
      this.buildRevokeWhereForCreate(args),
      new Date(),
    );
  }

  // Validation helpers

  private validateDeviceRequirements<T extends PersistentTokenType>(
    record: TokenOrmEntity,
    args: ValidateTokenArgs<T>,
  ): void {
    if (!TOKEN_CONFIG[record.type].requiresDeviceId) {
      return;
    }

    if (!('deviceId' in args) || !args.deviceId) {
      throw new UnauthorizedException('DeviceId is required');
    }

    if (!record.deviceId || record.deviceId !== args.deviceId) {
      throw new UnauthorizedException('Device mismatch');
    }
  }

  private validateSessionRequirements<T extends PersistentTokenType>(
    record: TokenOrmEntity,
    args: ValidateTokenArgs<T>,
  ): void {
    if (
      !TOKEN_CONFIG[record.type].requiresSessionId ||
      ('skipSessionCheck' in args && args.skipSessionCheck)
    ) {
      return;
    }

    if (!('sessionId' in args) || !args.sessionId) {
      throw new UnauthorizedException('SessionId is required');
    }

    if (!record.sessionId || record.sessionId !== args.sessionId) {
      throw new UnauthorizedException('Session mismatch');
    }
  }

  private validateUserAssociation(
    record: TokenOrmEntity,
    type: PersistentTokenType,
  ): void {
    if (type === TokenType.INITIAL_SETUP) {
      if (record.userId !== null) {
        throw new UnauthorizedException(
          'INITIAL_SETUP token must not be associated with a user',
        );
      }

      return;
    }

    if (record.userId === null) {
      throw new UnauthorizedException('Token is not associated with a user');
    }
  }

  // Public API

  async createToken<T extends PersistentTokenType>(
    args: CreateTokenArgs<T>,
  ): Promise<{
    encodedToken: string;
    tokenRecord: TypedToken<T>;
  }> {
    await this.revokeExistingTokensForCreate(args);

    const rawToken = generateRandomToken();
    const tokenHash = await hashToken(rawToken);

    const payload = buildTokenPayload(args.type, args);

    const record = this.tokensRepository.create({
      userId: args.userId,
      type: args.type,
      tokenHash,
      payload,
      deviceId: 'deviceId' in args ? args.deviceId : null,
      sessionId: 'sessionId' in args ? args.sessionId : null,
      expiresAt: new Date(Date.now() + TOKEN_CONFIG[args.type].ttl),
    });

    const saved = await this.tokensRepository.save(record);

    return {
      encodedToken: encodeToken(saved.id, rawToken),
      tokenRecord: saved as TypedToken<T>,
    };
  }

  async validateToken<T extends PersistentTokenType>(
    args: ValidateTokenArgs<T>,
  ): Promise<ValidatedToken<T>> {
    const { tokenId, rawToken } = decodeToken(args.encodedToken);

    const record = await this.tokensRepository.findById(tokenId);

    if (!record) {
      throw new UnauthorizedException('Token not found');
    }

    if (record.type !== args.type) {
      throw new UnauthorizedException('Invalid token type');
    }

    if (record.revokedAt) {
      throw new UnauthorizedException('Token revoked');
    }

    if (record.expiresAt < new Date()) {
      throw new UnauthorizedException('Token expired');
    }

    const valid = await verifyTokenHash(record.tokenHash, rawToken);

    if (!valid) {
      throw new UnauthorizedException('Invalid token');
    }

    this.validateDeviceRequirements(record, args);

    this.validateSessionRequirements(record, args);

    this.validateUserAssociation(record, args.type);

    return record as ValidatedToken<T>;
  }

  async revokeTokenById(id: number, date = new Date()): Promise<void> {
    await this.tokensRepository.revokeById(id, date);
  }

  async revokeTokensByType(type: PersistentTokenType, date = new Date()) {
    return this.tokensRepository.revokeWhere({ type }, date);
  }

  async updateTokenPayload(
    id: number,
    payload: TokenPayload | null,
  ): Promise<void> {
    await this.tokensRepository.updatePayloadById(id, payload);
  }

  async mergeTokenPayload(
    id: number,
    payloadPatch: Record<string, unknown>,
  ): Promise<void> {
    await this.tokensRepository.mergePayloadById(id, payloadPatch);
  }
}
