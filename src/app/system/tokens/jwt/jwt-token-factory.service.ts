import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtSecretResolverService } from './jwt-secret-resolver.service';
import { UserTokenType } from '../tokens.types';
import { TOKEN_TTL } from '../tokens-ttl.constants';
import { JwtPayloads } from './jwt.payload';

@Injectable()
export class JwtTokenFactoryService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly secretResolver: JwtSecretResolverService,
  ) {}

  sign(payload: object, tokenType: UserTokenType): string {
    return this.jwtService.sign(payload, {
      secret: this.secretResolver.getSecret(tokenType),
      expiresIn: TOKEN_TTL[tokenType] / 1000,
    });
  }

  verify<T extends UserTokenType>(token: string, tokenType: T): JwtPayloads[T] {
    return this.jwtService.verify<JwtPayloads[T]>(token, {
      secret: this.secretResolver.getSecret(tokenType),
    });
  }
}
