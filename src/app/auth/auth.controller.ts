import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('avatar'))
  async register(
    @Body() registerDto: RegisterDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ): Promise<{ user: User; accessToken: string }> {
    return this.authService.signUp(registerDto, avatar);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  signIn(
    @Body() signinDto: SignInDto,
  ): Promise<{ user: User; accessToken: string }> {
    return this.authService.signIn(signinDto);
  }
}
