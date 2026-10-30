import { Injectable } from '@nestjs/common';
import { TokenService } from '../tokens.service';
import { ProfileEntity } from 'src/app/product/profile/entities/profile.entity';
import { TokenType, ValidatedToken } from '../tokens.types';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly tokenService: TokenService) {}

  async createRefreshToken(userId: ProfileEntity['id'], deviceId: string) {
    return this.tokenService.createToken({
      type: TokenType.REFRESH,
      userId,
      deviceId,
    });
  }

  async validateRefreshToken(
    encodedToken: string,
    deviceId: string,
  ): Promise<ValidatedToken<TokenType.REFRESH>> {
    return this.tokenService.validateToken({
      type: TokenType.REFRESH,
      encodedToken,
      deviceId,
    });
  }
}
