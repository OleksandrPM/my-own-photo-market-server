import { Injectable } from '@nestjs/common';
import { TokenService } from '../tokens.service';
import { TokenType } from '../tokens.types';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';

@Injectable()
export class EmailConfirmTokenService {
  constructor(private readonly tokenService: TokenService) {}

  async createEmailConfirmationToken(userId: UserEntity['id']) {
    return this.tokenService.createToken({
      type: TokenType.EMAIL_CONFIRMATION,
      userId,
    });
  }

  async validateEmailConfirmationToken(tokenId: number, token: string) {
    return this.tokenService.validateToken({
      type: TokenType.EMAIL_CONFIRMATION,
      tokenId,
      token,
    });
  }
}
