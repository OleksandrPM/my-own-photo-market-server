import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';
import { TokenType } from '../tokens.types';
import { JwtTokenService } from '../jwt/jwt-token.service';

@Injectable()
export class AccessTokenService {
  constructor(private readonly jwtToken: JwtTokenService) {}

  generateAccessToken(userId: UserEntity['id']): string {
    return this.jwtToken.signAccessToken({
      sub: userId,
      type: TokenType.ACCESS,
    });
  }
}
