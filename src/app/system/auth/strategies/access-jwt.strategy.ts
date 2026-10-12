import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ProfilesService } from 'src/app/product/profiles/profiles.service';
import { AuthenticatedUser } from 'src/app/product/profiles/user.types';
import { JwtPayloads } from '../../tokens/jwt/jwt.payload';
import { UserTokenType } from '../../tokens/tokens.types';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly config: ConfigService,
    private readonly profilesService: ProfilesService,
  ) {
    const secret = config.get<string>('JWT_ACCESS_SECRET');

    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is missing in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  async validate(
    payload: JwtPayloads[UserTokenType.ACCESS],
  ): Promise<AuthenticatedUser> {
    if (!payload.userId) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    const user = await this.profilesService.findById(payload.userId);

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };
  }
}
