import { Injectable } from '@nestjs/common';
import { TokenService } from '../tokens.service';
import { UserTokenType } from '../tokens.types';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';

@Injectable()
export class PasswordResetTokenService {
  constructor(private readonly tokenService: TokenService) {}

  async createPasswordResetToken(user: UserEntity) {
    return this.tokenService.createToken({
      type: UserTokenType.PASSWORD_RESET,
      user,
    });
  }

  async validatePasswordResetToken(token: string) {
    return this.tokenService.validateToken({
      type: UserTokenType.PASSWORD_RESET,
      token,
    });
  }
}
