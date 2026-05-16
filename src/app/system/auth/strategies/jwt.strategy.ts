import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ProfilesService } from 'src/app/product/profiles/profiles.service';
import { AuthenticatedUser } from 'src/app/product/profiles/user.types';

export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly profilesService: ProfilesService,
  ) {
    const secret = config.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is missing in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const userId = Number(payload.sub);

    if (!Number.isFinite(userId)) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    const user = await this.profilesService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    return {
      id: userId,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };
  }
}
