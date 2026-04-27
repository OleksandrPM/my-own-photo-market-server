import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FindOptionsWhere, IsNull } from 'typeorm';
import { UserToken } from './entities/user-token.entity';
import {
  CreateTokenArgs,
  TOKEN_UNIQUENESS,
  TypedUserToken,
  UniquenessType,
  UserTokenType,
} from './tokens.types';
import { TOKEN_TTL } from './tokens.ttl';
import { buildTokenPayload, TokenPayloadInputs } from './tokens.payload';
import {
  generateRandomToken,
  hashToken,
  verifyTokenHash,
} from './tokens.utils';
import { UserTokensRepository } from 'src/app/infrastructure/data/database/user-tokens/user-tokens.repository';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(
    private readonly tokensRepository: UserTokensRepository,
    private readonly jwt: JwtService,
  ) {}

  async revokeExistingTokens(
    type: UserTokenType,
    userId: number | null,
    deviceId?: string,
  ) {
    const rule = TOKEN_UNIQUENESS[type];

    if (rule === UniquenessType.MULTIPLE) return;

    const where: FindOptionsWhere<UserToken> = {
      type,
      revokedAt: IsNull(),
      userId: userId === null ? IsNull() : userId,
    };

    if (rule === UniquenessType.PER_DEVICE) {
      where.deviceId = deviceId ? deviceId : IsNull();
    }

    await this.tokensRepository.revokeWhere(where, new Date());
  }

  async createToken<T extends UserTokenType>(
    args: CreateTokenArgs<T>,
  ): Promise<{ id: number; rawToken: string; expiresAt: Date }> {
    const { type } = args;

    const user = args.user;
    const deviceId = 'deviceId' in args ? args.deviceId : undefined;
    const extra = (
      'extra' in args ? args.extra : null
    ) as TokenPayloadInputs[T]['extra'];

    if (TOKEN_UNIQUENESS[type] === UniquenessType.PER_DEVICE && !deviceId) {
      throw new Error('deviceId must be provided for PER_DEVICE token type');
    }

    // revoke previous tokens
    await this.revokeExistingTokens(type, user ? user.id : null, deviceId);

    // generate token
    const rawToken = generateRandomToken();
    const tokenHash = await hashToken(rawToken);

    // build payload
    const payload = buildTokenPayload(type, {
      user,
      extra,
    } as TokenPayloadInputs[T]);

    const expiresIn = TOKEN_TTL[type];

    // persist
    const record = this.tokensRepository.create({
      userId: user ? user.id : null,
      type,
      tokenHash,
      payload,
      deviceId: deviceId ?? null,
      expiresAt: new Date(Date.now() + expiresIn),
    });

    const { id, expiresAt } = await this.tokensRepository.save(record);
    return { id, rawToken, expiresAt };
  }

  async validateToken<T extends UserTokenType>(args: {
    type: T;
    token: string;
    deviceId?: string;
  }): Promise<TypedUserToken<T>> {
    const { type, token, deviceId } = args;

    if (TOKEN_UNIQUENESS[type] === UniquenessType.PER_DEVICE && !deviceId) {
      throw new UnauthorizedException(
        'DeviceId is required for this token type',
      );
    }

    const where: FindOptionsWhere<UserToken> = {
      type,
      revokedAt: IsNull(),
    };

    if (TOKEN_UNIQUENESS[type] === UniquenessType.PER_DEVICE) {
      where.deviceId = deviceId!;
    }

    const records = await this.tokensRepository.findActiveByWhere(where);

    for (const record of records) {
      const isValid = await verifyTokenHash(record.tokenHash, token);
      if (!isValid) continue;

      if (record.expiresAt < new Date()) {
        throw new UnauthorizedException('Token expired');
      }

      if (deviceId && record.deviceId && record.deviceId !== deviceId) {
        throw new UnauthorizedException('Device mismatch');
      }

      if (record.userId === null && type !== UserTokenType.INITIAL_SETUP) {
        throw new UnauthorizedException('Token is not associated with a user');
      }

      if (record.userId !== null && type === UserTokenType.INITIAL_SETUP) {
        throw new UnauthorizedException(
          'INITIAL_SETUP token should not be associated with a user',
        );
      }

      return record as TypedUserToken<T>;
    }

    throw new UnauthorizedException('Invalid token');
  }

  async revokeToken(id: number) {
    await this.tokensRepository.revokeById(id, new Date());
  }

  generateAccessToken(user: UserEntity): string {
    return this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
