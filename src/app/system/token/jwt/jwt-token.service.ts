import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccessJwtPayload } from './jwt-payload.types';
import { TokenType } from '../token.types';
import { TOKEN_CONFIG } from '../token.config';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getAccessSecret(): string {
    return this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
  }

  signAccessToken(payload: AccessJwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.getAccessSecret(),
      expiresIn: TOKEN_CONFIG[TokenType.ACCESS].ttl / 1000,
    });
  }

  verifyAccessToken(token: string): AccessJwtPayload {
    return this.jwtService.verify<AccessJwtPayload>(token, {
      secret: this.getAccessSecret(),
    });
  }

  decodeAccessToken(token: string): AccessJwtPayload | null {
    const payload = this.jwtService.decode(token);

    if (!payload || typeof payload !== 'object') {
      return null;
    }

    return payload as AccessJwtPayload;
  }
}
