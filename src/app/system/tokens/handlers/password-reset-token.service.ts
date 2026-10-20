import { Injectable } from '@nestjs/common';
import { TokenService } from '../tokens.service';
import { TokenType } from '../tokens.types';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';

@Injectable()
export class PasswordResetTokenService {
  constructor(private readonly tokenService: TokenService) {}

  async createPasswordResetToken(userId: UserEntity['id'], email: string) {
    return this.tokenService.createToken({
      type: TokenType.PASSWORD_RESET,
      userId,
      email,
    });
  }

  async validatePasswordResetToken(tokenId: number, token: string) {
    return this.tokenService.validateToken({
      type: TokenType.PASSWORD_RESET,
      tokenId,
      token,
    });
  }
}
