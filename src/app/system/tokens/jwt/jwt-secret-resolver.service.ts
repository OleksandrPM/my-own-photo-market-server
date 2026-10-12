import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserTokenType } from '../tokens.types';
import { JWT_SECRET_ENV, TOKEN_SECRET_GROUP } from './jwt.constants';

@Injectable()
export class JwtSecretResolverService {
  constructor(private readonly configService: ConfigService) {}

  getSecret(tokenType: UserTokenType): string {
    const group = TOKEN_SECRET_GROUP[tokenType];
    const envKey = JWT_SECRET_ENV[group];

    return this.configService.getOrThrow<string>(envKey);
  }
}
