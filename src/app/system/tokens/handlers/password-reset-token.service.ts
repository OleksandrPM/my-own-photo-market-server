import { Injectable } from '@nestjs/common';
import { TokenService } from '../tokens.service';
import { UserTokenType } from '../tokens.types';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';

@Injectable()
export class PasswordResetTokenService {
  constructor(private readonly tokenService: TokenService) {}

  async createPasswordResetToken(user: UserEntity, email: string) {
    return this.tokenService.createToken({
      type: UserTokenType.PASSWORD_RESET,
      user,
      email,
    });
  }

  async validatePasswordResetToken(tokenId: number, token: string) {
    return this.tokenService.validateToken({
      type: UserTokenType.PASSWORD_RESET,
      tokenId,
      token,
    });
  }
}
