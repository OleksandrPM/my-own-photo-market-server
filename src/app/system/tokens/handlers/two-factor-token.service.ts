import { Injectable } from '@nestjs/common';
import { TokenService } from '../tokens.service';
import { TokenType } from '../tokens.types';
import { ProfileEntity } from 'src/app/product/profile/entities/profile.entity';

@Injectable()
export class TwoFactorAuthTokenService {
  constructor(private readonly tokenService: TokenService) {}

  async createTwoFaToken(userId: ProfileEntity['id'], deviceId: string) {
    return this.tokenService.createToken({
      type: TokenType.TWO_FA,
      userId,
      deviceId,
    });
  }

  async validateTwoFaToken(encodedToken: string, deviceId: string) {
    return this.tokenService.validateToken({
      type: TokenType.TWO_FA,
      encodedToken,
      deviceId,
    });
  }
}
