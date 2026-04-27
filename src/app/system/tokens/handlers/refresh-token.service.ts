import { Injectable } from '@nestjs/common';
import { TokenService } from '../tokens.service';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';
import { UserTokenType } from '../tokens.types';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly tokenService: TokenService) {}

  async createRefreshToken(user: UserEntity, deviceId?: string) {
    return this.tokenService.createToken({
      type: UserTokenType.REFRESH,
      user,
      deviceId,
    });
  }

  async validateRefreshToken(token: string, deviceId: string) {
    return this.tokenService.validateToken({
      type: UserTokenType.REFRESH,
      token,
      deviceId,
    });
  }
}
