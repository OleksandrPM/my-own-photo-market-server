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
import { RegisterDto } from './dto/register.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('avatar'))
  async register(
    @UploadedFile() avatar: Express.Multer.File | undefined,
    @Body() registerDto: RegisterDto,
  ): Promise<{
    user: UserResponseDto;
    accessToken: string;
    avatarUrl: string | null;
  }> {
    const result = await this.authService.signUp(registerDto, avatar);

    return {
      user: plainToInstance(UserResponseDto, result.user, {
        excludeExtraneousValues: true,
      }),
      accessToken: result.accessToken,
      avatarUrl: result.avatarUrl,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signinDto: SignInDto): Promise<{
    user: UserResponseDto;
    accessToken: string;
    avatarUrl: string | null;
  }> {
    const result = await this.authService.signIn(signinDto);

    return {
      user: plainToInstance(UserResponseDto, result.user, {
        excludeExtraneousValues: true,
      }),
      accessToken: result.accessToken,
      avatarUrl: result.avatarUrl,
    };
  }
}
