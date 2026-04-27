import { Injectable } from '@nestjs/common';
import { TokenService } from '../tokens.service';
import { UserTokenType } from '../tokens.types';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';

@Injectable()
export class EmailChangeTokenService {
  constructor(private readonly tokenService: TokenService) {}

  async createEmailChangeToken(user: UserEntity, newEmail: string) {
    return this.tokenService.createToken({
      type: UserTokenType.EMAIL_CHANGE,
      user,
      extra: { newEmail },
    });
  }

  async validateEmailChangeToken(token: string) {
    return this.tokenService.validateToken({
      type: UserTokenType.EMAIL_CHANGE,
      token,
    });
  }
}
