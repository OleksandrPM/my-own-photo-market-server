import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ProfilesService } from 'src/app/product/profile/profile.service';
import { AccessJwtPayload } from '../../tokens/jwt/jwt-payload.types';
import { TokenType } from '../../tokens/tokens.types';
import { AuthenticatedUser } from '../auth.types';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    configService: ConfigService,
    private readonly profilesService: ProfilesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: AccessJwtPayload): Promise<AuthenticatedUser> {
    if (payload.type !== TokenType.ACCESS) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    const user = await this.profilesService.findById(payload.sub);

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
