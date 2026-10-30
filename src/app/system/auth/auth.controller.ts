import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CookieService } from '../cookie/cookie.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { apiRoutes } from '../../common/api/api.routes';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CookieName } from '../cookie/cookie.types';
import { VerifyEmailResponseDto } from './dto/verify-email-response.dto';
import { MeResponseDto } from './dto/me-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { CurrentUser } from 'src/app/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from './auth.types';
import { Cookie } from 'src/app/common/decorators/cookie.decorator';
import { LogoutResponseDto } from './dto/logout-response.dto';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post(apiRoutes.AUTH.REGISTER)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'User avatar image. Optional.',
        },
        email: {
          type: 'string',
          example: 'user@example.com',
        },
        username: {
          type: 'string',
          nullable: true,
          example: 'john_doe',
          description: 'Optional. Can be null',
        },
        password: {
          type: 'string',
          example: 'StrongPass123!',
          minLength: 8,
          description: 'Must be strong password',
        },
      },
      required: ['email', 'password'],
    },
  })
  @ApiCreatedResponse({ type: AuthResponseDto })
  @UseInterceptors(FileInterceptor('avatar'))
  async register(
    @UploadedFile() avatar: Express.Multer.File | undefined,
    @Body() dto: RegisterDto,
    @Cookie(CookieName.DEVICE_ID) deviceId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { response, refreshToken } = await this.authService.signUp(
      dto,
      deviceId,
      avatar,
    );

    this.cookieService.setCookie(res, CookieName.REFRESH_TOKEN, refreshToken);

    return response;
  }

  @Post(apiRoutes.AUTH.LOGIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: AuthResponseDto })
  async login(
    @Body() dto: LoginDto,
    @Cookie(CookieName.DEVICE_ID) deviceId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { response, refreshToken } = await this.authService.signIn(
      dto,
      deviceId,
    );

    this.cookieService.setCookie(res, CookieName.REFRESH_TOKEN, refreshToken);

    return response;
  }

  @Get(apiRoutes.AUTH.VERIFY_EMAIL)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email address' })
  @ApiOkResponse({ type: VerifyEmailResponseDto })
  async verifyEmail(
    @Query('token') token: string,
  ): Promise<VerifyEmailResponseDto> {
    return this.authService.verifyEmail(token);
  }

  @Post(apiRoutes.AUTH.REFRESH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access & refresh tokens' })
  @ApiOkResponse({ type: RefreshResponseDto })
  async refresh(
    @Cookie(CookieName.REFRESH_TOKEN)
    refreshToken: string,
    @Cookie(CookieName.DEVICE_ID)
    deviceId: string,
    @Res({ passthrough: true })
    res: Response,
  ): Promise<RefreshResponseDto> {
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(refreshToken, deviceId);

    this.cookieService.setCookie(
      res,
      CookieName.REFRESH_TOKEN,
      newRefreshToken,
    );

    return {
      accessToken,
    };
  }

  @Get(apiRoutes.AUTH.ME)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ type: MeResponseDto })
  async getMe(@CurrentUser() user: AuthenticatedUser): Promise<MeResponseDto> {
    return this.authService.getMe(user.id);
  }

  @Post(apiRoutes.AUTH.LOGOUT)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout a user' })
  @ApiOkResponse({ type: LogoutResponseDto })
  async logout(
    @Cookie(CookieName.REFRESH_TOKEN)
    refreshToken: string,
    @Cookie(CookieName.DEVICE_ID)
    deviceId: string,
    @Res({ passthrough: true })
    res: Response,
  ): Promise<LogoutResponseDto> {
    await this.authService.logout(refreshToken, deviceId);

    this.cookieService.clearCookie(res, CookieName.REFRESH_TOKEN);

    this.cookieService.clearCookie(res, CookieName.CSRF_TOKEN);

    return {
      isLoggedOut: true,
    };
  }
}
