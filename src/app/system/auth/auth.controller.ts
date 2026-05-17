import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CookieService } from '../cookies/cookie.service';
import { SelfOnlyGuard } from './guards/self-only.guard';
import { AuthResponseDto } from './dto/auth-response.dto';
import { apiRoutes } from '../../common/path-builder/api.routes';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/types/authenticated-request.types';
import { CookieName } from '../cookies/cookies.types';
import { VerifyEmailResponseDto } from './dto/verify-email-response.dto';
import { MeResponseDto } from './dto/me-response.dto';

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
        email: { type: 'string', example: 'user@example.com' },
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
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { response, refreshToken, deviceId } = await this.authService.signUp(
      dto,
      avatar,
    );

    this.cookieService.setRefreshTokenCookie(res, refreshToken);
    this.cookieService.setDeviceIdCookie(res, deviceId);

    return response;
  }

  @Post(apiRoutes.AUTH.LOGIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: AuthResponseDto })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { response, refreshToken, deviceId } =
      await this.authService.signIn(dto);

    this.cookieService.setRefreshTokenCookie(res, refreshToken);
    this.cookieService.setDeviceIdCookie(res, deviceId);

    return response;
  }

  @Post(apiRoutes.AUTH.LOGOUT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout a user' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: { success: { type: 'boolean' } },
      example: { success: true },
    },
  })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ isLoggedOut: boolean }> {
    const refreshToken = req.cookies?.[CookieName.REFRESH_TOKEN];
    const deviceId = req.cookies?.[CookieName.DEVICE_ID];

    if (refreshToken && deviceId) {
      await this.authService.logout(refreshToken, deviceId);
    }

    this.cookieService.clearRefreshTokenCookie(res);
    this.cookieService.clearDeviceIdCookie(res);

    return { isLoggedOut: true };
  }

  @Post(apiRoutes.AUTH.VERIFY_EMAIL)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email address' })
  @ApiOkResponse({ type: VerifyEmailResponseDto })
  async verifyEmail(@Req() req: Request): Promise<VerifyEmailResponseDto> {
    const token = req.query.token;

    if (typeof token !== 'string') {
      throw new BadRequestException('Verification token is missing or invalid');
    }

    return this.authService.verifyEmail(token);
  }

  @Post(apiRoutes.AUTH.REFRESH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
      },
    },
  })
  @UseGuards(SelfOnlyGuard)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.[CookieName.REFRESH_TOKEN];
    const deviceId = req.cookies?.[CookieName.DEVICE_ID];

    if (!refreshToken || !deviceId) {
      throw new UnauthorizedException('Refresh token or device ID missing');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(refreshToken, deviceId);

    this.cookieService.setRefreshTokenCookie(res, newRefreshToken);

    return { accessToken };
  }

  @Get(apiRoutes.AUTH.ME)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ type: MeResponseDto })
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: AuthenticatedRequest): Promise<MeResponseDto> {
    const userId = req.user!.id;
    const user = await this.authService.getMe(userId);

    return user;
  }
}
