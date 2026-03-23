import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import { UserToken } from './entities/user-token.entity';
import { UserTokenType } from './token.types';
import { JwtService } from '@nestjs/jwt';
import { DbConnectionName } from '../db/db.config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { TOKEN_TTL } from './token.ttl';
import { TOKEN_PAYLOAD } from './token.payload';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(UserToken, DbConnectionName.READER)
    private readonly readerRepository: Repository<UserToken>,

    @InjectRepository(UserToken, DbConnectionName.EDITOR)
    private readonly editorRepository: Repository<UserToken>,

    private readonly jwt: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async createToken({
    user,
    type,
    extra,
    deviceId,
  }: {
    user: User;
    type: UserTokenType;
    extra?: any;
    deviceId?: string;
  }) {
    const rawToken = crypto.randomUUID();
    const tokenHash = await argon2.hash(rawToken);

    const builder = TOKEN_PAYLOAD[type];
    const payload = builder ? builder(user, extra) : null;
    const expiresIn = TOKEN_TTL[type];

    const record = this.editorRepository.create({
      userId: user.id,
      type,
      tokenHash,
      payload,
      deviceId: deviceId ?? null,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
    });

    const { id, expiresAt } = await this.editorRepository.save(record);

    return { id, rawToken, expiresAt };
  }

  createRefreshToken(user: User, deviceId?: string) {
    return this.createToken({
      user,
      type: UserTokenType.REFRESH,
      deviceId,
    });
  }

  createEmailConfirmationToken(user: User) {
    return this.createToken({
      user,
      type: UserTokenType.EMAIL_CONFIRMATION,
    });
  }

  createPasswordResetToken(user: User) {
    return this.createToken({
      user,
      type: UserTokenType.PASSWORD_RESET,
    });
  }

  createEmailChangeToken(user: User, newEmail: string) {
    return this.createToken({
      user,
      type: UserTokenType.EMAIL_CHANGE,
      extra: { newEmail },
    });
  }

  createTwoFaToken(user: User) {
    return this.createToken({
      user,
      type: UserTokenType.TWO_FA,
    });
  }

  async validateToken({
    type,
    token,
    deviceId,
  }: {
    type: UserTokenType;
    token: string;
    deviceId?: string;
  }) {
    const records = await this.readerRepository.find({
      where: { type, revokedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });

    for (const record of records) {
      const isValid = await argon2.verify(record.tokenHash, token);

      if (isValid) {
        if (record.expiresAt < new Date()) {
          throw new UnauthorizedException('Token expired');
        }

        if (deviceId && record.deviceId && record.deviceId !== deviceId) {
          throw new UnauthorizedException('Device mismatch');
        }

        const user = await this.usersService.findById(record.userId);

        if (!user) {
          throw new UnauthorizedException('User not found');
        }

        return { user, tokenRecord: record };
      }
    }

    throw new UnauthorizedException('Invalid token');
  }

  async validateRefreshToken(token: string, deviceId?: string) {
    if (!deviceId) {
      throw new UnauthorizedException('Device ID missing');
    }

    return this.validateToken({
      type: UserTokenType.REFRESH,
      token,
      deviceId,
    });
  }

  async validateEmailConfirmationToken(token: string) {
    return this.validateToken({
      type: UserTokenType.EMAIL_CONFIRMATION,
      token,
    });
  }

  async revokeToken(id: number) {
    await this.editorRepository.update(id, { revokedAt: new Date() });
  }

  generateAccessToken(user: User): string {
    return this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
