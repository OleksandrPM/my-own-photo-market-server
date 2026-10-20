import { Injectable } from '@nestjs/common';
import { TokenService } from '../tokens.service';
import { TokenType } from '../tokens.types';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';

@Injectable()
export class TwoFactorAuthTokenService {
  constructor(private readonly tokenService: TokenService) {}

  async createTwoFaToken(userId: UserEntity['id'], sessionId: string) {
    return this.tokenService.createToken({
      type: TokenType.TWO_FA,
      userId,
      sessionId,
    });
  }

  async validateTwoFaToken(tokenId: number, token: string, sessionId: string) {
    return this.tokenService.validateToken({
      type: TokenType.TWO_FA,
      tokenId,
      token,
      sessionId,
    });
  }
}
