import { Injectable } from '@nestjs/common';
import { TokenService } from '../tokens.service';
import { TokenType } from '../tokens.types';
import { ProfileEntity } from 'src/app/product/profile/entities/profile.entity';

@Injectable()
export class EmailConfirmTokenService {
  constructor(private readonly tokenService: TokenService) {}

  async createEmailConfirmationToken(userId: ProfileEntity['id']) {
    return this.tokenService.createToken({
      type: TokenType.EMAIL_CONFIRMATION,
      userId,
    });
  }

  async validateEmailConfirmationToken(encodedToken: string) {
    return this.tokenService.validateToken({
      type: TokenType.EMAIL_CONFIRMATION,
      encodedToken,
    });
  }
}
