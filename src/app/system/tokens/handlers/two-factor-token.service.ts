import { Injectable } from '@nestjs/common';
import { TokenService } from '../tokens.service';
import { UserTokenType } from '../tokens.types';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';

@Injectable()
export class TwoFactorAuthTokenService {
  constructor(private readonly tokenService: TokenService) {}

  async createTwoFaToken(user: UserEntity) {
    return this.tokenService.createToken({
      type: UserTokenType.TWO_FA,
      user,
    });
  }

  async validateTwoFaToken(token: string) {
    return this.tokenService.validateToken({
      type: UserTokenType.TWO_FA,
      token,
    });
  }
}
