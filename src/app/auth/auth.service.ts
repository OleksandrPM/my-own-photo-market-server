import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../password/password.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}

  async signUp(
    newUser: CreateUserDto,
  ): Promise<User & { access_token: string }> {
    const user = await this.usersService.create(newUser);
    const access_token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return { ...user, access_token };
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<User & { access_token: string }> {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const isPasswordLegal = await this.passwordService.verifyPassword(
        user.passwordHash,
        password,
      );

      if (isPasswordLegal) {
        const access_token = await this.jwtService.signAsync({
          sub: user.id,
          email: user.email,
        });

        return { ...user, access_token };
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
