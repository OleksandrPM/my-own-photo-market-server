import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/app/product/profiles/entities/user.entity';

@Injectable()
export class AccessTokenService {
  constructor(private readonly jwt: JwtService) {}
  generateAccessToken(user: UserEntity): string {
    return this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
