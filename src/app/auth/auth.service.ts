import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../password/password.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SignInDto } from './dto/signin.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}

  async signUp(
    newUser: RegisterDto,
    avatar?: Express.Multer.File,
  ): Promise<{ user: User; accessToken: string }> {
    // 1. Create user
    const user = await this.usersService.createUser(newUser, avatar);

    // 2. Generate access token
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return { user, accessToken };
  }

  async signIn({
    email,
    password,
  }: SignInDto): Promise<{ user: User; accessToken: string }> {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const isPasswordLegal = await this.passwordService.verifyPassword(
        user.passwordHash,
        password,
      );

      if (isPasswordLegal) {
        const accessToken = await this.jwtService.signAsync({
          sub: user.id,
          email: user.email,
        });

        return { user, accessToken };
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
