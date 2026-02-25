import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../password/password.service';
import { User } from '../users/entities/user.entity';
import { SignInDto } from './dto/signin.dto';
import { RegisterDto } from './dto/register.dto';
import { R2Service } from '../r2/r2.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly r2Service: R2Service,
  ) {}

  async signUp(
    newUserDto: RegisterDto,
    avatar?: Express.Multer.File,
  ): Promise<{ user: User; accessToken: string; avatarUrl: string | null }> {
    // 1. Create user
    const user = await this.usersService.createUser(newUserDto, avatar);

    if (!user) {
      throw new Error('User creation failed');
    }

    // 2. Generate access token
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    // 3. Build avatar URL if avatar was uploaded
    const avatarUrl = user.avatarKey
      ? await this.r2Service.createSignedUrl(user.avatarKey, 3600)
      : null;

    return { user, accessToken, avatarUrl };
  }

  async signIn({ email, password }: SignInDto): Promise<{
    user: User;
    accessToken: string;
    avatarUrl: string | null;
  }> {
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

        // 3. Build avatar URL if avatar was uploaded
        const avatarUrl = user.avatarKey
          ? await this.r2Service.createSignedUrl(user.avatarKey, 3600)
          : null;

        return { user, accessToken, avatarUrl };
      } else {
        throw new UnauthorizedException('Incorrect password');
      }
    } else {
      throw new UnauthorizedException(`User with email ${email} not found`);
    }
  }
}
