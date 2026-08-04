import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IsNull } from 'typeorm';

import { TOKEN_TTL } from './tokens.ttl';
import {
  AnyTypedUserToken,
  AnyValidateTokenArgs,
  CreateTokenArgs,
  CreateArgsMap,
  TOKEN_UNIQUENESS,
  TypedUserToken,
  UniquenessType,
  UserTokenType,
  ValidateArgsMap,
} from './tokens.types';
import {
  buildTokenPayload,
  TokenPayloadInputs,
  UserTokenPayload,
} from './tokens.payload';
import {
  generateRandomToken,
  hashToken,
  verifyTokenHash,
} from './tokens.utils';

import { UserTokensRepository } from 'src/app/infrastructure/data/database/user-tokens/user-tokens.repository';
import { TokenWhere } from 'src/app/infrastructure/data/database/user-tokens/user-tokens.types';

import { UserEntity } from 'src/app/product/profiles/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(private readonly tokensRepository: UserTokensRepository) {}

  // ---------------- Helpers ----------------

  private requiresDeviceId(type: UserTokenType): boolean {
    return TOKEN_UNIQUENESS[type] === UniquenessType.PER_DEVICE;
  }

  private requiresSessionId(type: UserTokenType): boolean {
    return (
      type === UserTokenType.INITIAL_SETUP ||
      type === UserTokenType.REFRESH ||
      type === UserTokenType.TWO_FA
    );
  }

  private requiresUserAssociation(type: UserTokenType): boolean {
    return type !== UserTokenType.INITIAL_SETUP;
  }

  private buildRevokeWhereForCreate<T extends UserTokenType>(
    args: CreateTokenArgs<T>,
  ): TokenWhere {
    switch (args.type) {
      case UserTokenType.INITIAL_SETUP:
        return {
          type: args.type,
          sessionId: args.sessionId,
          revokedAt: IsNull(),
        };

      case UserTokenType.REFRESH:
        return {
          type: args.type,
          userId: args.user.id,
          deviceId: args.deviceId,
          revokedAt: IsNull(),
        };

      // SINGLE user-bound токени
      case UserTokenType.EMAIL_CONFIRMATION:
      case UserTokenType.EMAIL_CHANGE:
      case UserTokenType.PASSWORD_RESET:
      case UserTokenType.TWO_FA:
        return {
          type: args.type,
          userId: args.user ? args.user.id : IsNull(),
          revokedAt: IsNull(),
        };

      default: {
        // exhaustive
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _never: never = args;
        return { revokedAt: IsNull() } as TokenWhere;
      }
    }
  }

  private async revokeExistingTokensForCreate<T extends UserTokenType>(
    args: CreateTokenArgs<T>,
  ) {
    const where = this.buildRevokeWhereForCreate(args);
    await this.tokensRepository.revokeWhere(where, new Date());
  }

  // ---------------- Public API ----------------

  async createToken<T extends UserTokenType>(
    args: CreateTokenArgs<T>,
  ): Promise<{
    id: number;
    rawToken: string;
    expiresAt: Date;
    record: TypedUserToken<T>;
  }> {
    const type = args.type;

    // revoke previous by scope
    await this.revokeExistingTokensForCreate(args);

    // 2) secret + hash
    const rawToken = generateRandomToken();
    const tokenHash = await hashToken(rawToken);

    // 3) payload (будується з args, які є TokenPayloadInputs[T])
    const payload = buildTokenPayload(
      type,
      args as unknown as TokenPayloadInputs[UserTokenType],
    ) as UserTokenPayload;

    // 4) entity fields
    const user = (args as CreateArgsMap[UserTokenType])
      .user as UserEntity | null;

    const deviceId =
      'deviceId' in args
        ? (args as CreateArgsMap[UserTokenType.REFRESH]).deviceId
        : null;

    const sessionId =
      'sessionId' in args ? ((args as any).sessionId ?? null) : null;

    const expiresAt = new Date(Date.now() + TOKEN_TTL[type]);

    const record = this.tokensRepository.create({
      userId: user ? user.id : null,
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
      record: saved as unknown as TypedUserToken<T>,
    };
  }

  // ---- validateToken overloads (щоб IDE підказувала правильно) ----

  async validateToken(
    args: ValidateArgsMap[UserTokenType.EMAIL_CONFIRMATION],
  ): Promise<TypedUserToken<UserTokenType.EMAIL_CONFIRMATION>>;
  async validateToken(
    args: ValidateArgsMap[UserTokenType.INITIAL_SETUP],
  ): Promise<TypedUserToken<UserTokenType.INITIAL_SETUP>>;
  async validateToken(
    args: ValidateArgsMap[UserTokenType.EMAIL_CHANGE],
  ): Promise<TypedUserToken<UserTokenType.EMAIL_CHANGE>>;
  async validateToken(
    args: ValidateArgsMap[UserTokenType.PASSWORD_RESET],
  ): Promise<TypedUserToken<UserTokenType.PASSWORD_RESET>>;
  async validateToken(
    args: ValidateArgsMap[UserTokenType.REFRESH],
  ): Promise<TypedUserToken<UserTokenType.REFRESH>>;
  async validateToken(
    args: ValidateArgsMap[UserTokenType.TWO_FA],
  ): Promise<TypedUserToken<UserTokenType.TWO_FA>>;

  async validateToken(args: AnyValidateTokenArgs): Promise<AnyTypedUserToken> {
    const now = new Date();

    // 1) load by id
    const record = await this.tokensRepository.findById(args.tokenId);

    if (!record) throw new UnauthorizedException('Invalid token');
    if (record.type !== args.type)
      throw new UnauthorizedException('Invalid token type');
    if (record.revokedAt) throw new UnauthorizedException('Token revoked');
    if (record.expiresAt < now)
      throw new UnauthorizedException('Token expired');

    // 2) verify secret
    const ok = await verifyTokenHash(record.tokenHash, args.token);
    if (!ok) throw new UnauthorizedException('Invalid token');

    // 3) device check
    if (this.requiresDeviceId(args.type)) {
      if (!('deviceId' in args) || !args.deviceId) {
        throw new UnauthorizedException('DeviceId is required');
      }

      if (!record.deviceId || record.deviceId !== args.deviceId) {
        throw new UnauthorizedException('Device mismatch');
      }
    }

    // 4) session check
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

    // 5) user association rule
    if (this.requiresUserAssociation(args.type)) {
      if (record.userId === null) {
        throw new UnauthorizedException('Token is not associated with a user');
      }
    } else {
      // INITIAL_SETUP must be anonymous
      if (record.userId !== null) {
        throw new UnauthorizedException(
          'INITIAL_SETUP token must not be associated with a user',
        );
      }
    }

    return record as unknown as AnyTypedUserToken;
  }

  async revokeTokenById(id: number, date = new Date()) {
    await this.tokensRepository.revokeById(id, date);
  }

  async revokeTokensByType(tokenType: UserTokenType, date = new Date()) {
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
