import { Injectable } from '@nestjs/common';
import { TokenService } from '../tokens.service';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';
import { TokenType } from '../tokens.types';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly tokenService: TokenService) {}

  async createRefreshToken(userId: UserEntity['id'], deviceId: string) {
    return this.tokenService.createToken({
      type: TokenType.REFRESH,
      userId,
      deviceId,
    });
  }

  async validateRefreshToken(tokenId: number, token: string, deviceId: string) {
    return this.tokenService.validateToken({
      type: TokenType.REFRESH,
      tokenId,
      token,
      deviceId,
    });
  }
}
