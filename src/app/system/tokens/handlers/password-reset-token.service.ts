import { Injectable } from '@nestjs/common';
import { TokenService } from '../tokens.service';
import { TokenType } from '../tokens.types';
import { ProfileEntity } from 'src/app/product/profile/entities/profile.entity';

@Injectable()
export class PasswordResetTokenService {
  constructor(private readonly tokenService: TokenService) {}

  async createPasswordResetToken(userId: ProfileEntity['id'], email: string) {
    return this.tokenService.createToken({
      type: TokenType.PASSWORD_RESET,
      userId,
      email,
    });
  }

  async validatePasswordResetToken(encodedToken: string) {
    return this.tokenService.validateToken({
      type: TokenType.PASSWORD_RESET,
      encodedToken,
    });
  }
}
