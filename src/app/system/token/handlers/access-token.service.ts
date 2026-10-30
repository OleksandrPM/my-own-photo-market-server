import { Injectable } from '@nestjs/common';
import { ProfileEntity } from 'src/app/product/profile/entities/profile.entity';
import { TokenType } from '../token.types';
import { JwtTokenService } from '../jwt/jwt-token.service';

@Injectable()
export class AccessTokenService {
  constructor(private readonly jwtToken: JwtTokenService) {}

  generateAccessToken(userId: ProfileEntity['id']): string {
    return this.jwtToken.signAccessToken({
      sub: userId,
      type: TokenType.ACCESS,
    });
  }
}
