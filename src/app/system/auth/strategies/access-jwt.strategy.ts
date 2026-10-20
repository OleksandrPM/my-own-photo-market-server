import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ProfilesService } from 'src/app/product/profiles/profiles.service';
import { AuthenticatedUser } from 'src/app/product/profiles/user.types';
import { AccessJwtPayload } from '../../tokens/jwt/jwt-payload.types';
import { TokenType } from '../../tokens/tokens.types';
import { ConfigService } from '@nestjs/config';

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
