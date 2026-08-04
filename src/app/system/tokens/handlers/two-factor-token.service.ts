import { Injectable } from '@nestjs/common';
import { TokenService } from '../tokens.service';
import { UserTokenType } from '../tokens.types';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';

@Injectable()
export class TwoFactorAuthTokenService {
  constructor(private readonly tokenService: TokenService) {}

  async createTwoFaToken(user: UserEntity, sessionId: string) {
    return this.tokenService.createToken({
      type: UserTokenType.TWO_FA,
      user,
      sessionId,
    });
  }

  async validateTwoFaToken(tokenId: number, token: string, sessionId: string) {
    return this.tokenService.validateToken({
      type: UserTokenType.TWO_FA,
      tokenId,
      token,
      sessionId,
    });
  }
}
