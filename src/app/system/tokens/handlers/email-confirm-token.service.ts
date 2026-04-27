import { Injectable } from '@nestjs/common';
import { TokenService } from '../tokens.service';
import { UserTokenType } from '../tokens.types';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';

@Injectable()
export class EmailConfirmTokenService {
  constructor(private readonly tokenService: TokenService) {}

  async createEmailConfirmationToken(user: UserEntity) {
    return this.tokenService.createToken({
      type: UserTokenType.EMAIL_CONFIRMATION,
      user,
    });
  }

  async validateEmailConfirmationToken(token: string) {
    return this.tokenService.validateToken({
      type: UserTokenType.EMAIL_CONFIRMATION,
      token,
    });
  }
}
