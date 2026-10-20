import { Injectable } from '@nestjs/common';
import { TokenService } from '../tokens.service';
import { TokenType } from '../tokens.types';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';

@Injectable()
export class EmailChangeTokenService {
  constructor(private readonly tokenService: TokenService) {}

  async createEmailChangeToken(userId: UserEntity['id'], newEmail: string) {
    return this.tokenService.createToken({
      type: TokenType.EMAIL_CHANGE,
      userId,
      newEmail,
    });
  }

  async validateEmailChangeToken(tokenId: number, token: string) {
    return this.tokenService.validateToken({
      type: TokenType.EMAIL_CHANGE,
      tokenId,
      token,
    });
  }
}
