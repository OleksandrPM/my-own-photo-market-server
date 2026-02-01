import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  register(
    @Body() registerDto: CreateUserDto,
  ): Promise<User & { access_token: string }> {
    return this.authService.signUp(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  signIn(
    @Body() signInDto: SignInDto,
  ): Promise<User & { access_token: string }> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}
