import { Injectable } from '@nestjs/common';
import { TokenService } from '../tokens.service';
import { TokenType } from '../tokens.types';
import { ProfileEntity } from 'src/app/product/profile/entities/profile.entity';

@Injectable()
export class EmailChangeTokenService {
  constructor(private readonly tokenService: TokenService) {}

  async createEmailChangeToken(userId: ProfileEntity['id'], newEmail: string) {
    return this.tokenService.createToken({
      type: TokenType.EMAIL_CHANGE,
      userId,
      newEmail,
    });
  }

  async validateEmailChangeToken(encodedToken: string) {
    return this.tokenService.validateToken({
      type: TokenType.EMAIL_CHANGE,
      encodedToken,
    });
  }
}
