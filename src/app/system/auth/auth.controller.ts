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
import { ApiTags } from '@nestjs/swagger';
import { ProfileResponseDto } from 'src/app/product/profiles/dto/profile-response.dto';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post(apiRoutes.AUTH.REGISTER)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('avatar'))
  async register(
    @UploadedFile() avatar: Express.Multer.File | undefined,
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { user, accessToken, refreshToken, deviceId, warning } =
      await this.authService.signUp(dto, avatar);

    this.cookieService.setRefreshTokenCookie(res, refreshToken);
    this.cookieService.setDeviceIdCookie(res, deviceId);

    return {
      user,
      accessToken,
      ...(warning ? { warning } : {}),
    };
  }

  @Post(apiRoutes.AUTH.LOGIN)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { user, accessToken, refreshToken, deviceId, warning } =
      await this.authService.signIn(dto);

    this.cookieService.setRefreshTokenCookie(res, refreshToken);
    this.cookieService.setDeviceIdCookie(res, deviceId);

    return {
      user,
      accessToken,
      ...(warning ? { warning } : {}),
    };
  }

  @Post(apiRoutes.AUTH.LOGOUT)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.[CookieName.REFRESH_TOKEN];
    const deviceId = req.cookies?.[CookieName.DEVICE_ID];

    if (refreshToken && deviceId) {
      await this.authService.logout(refreshToken, deviceId);
    }

    this.cookieService.clearRefreshTokenCookie(res);
    this.cookieService.clearDeviceIdCookie(res);

    return { success: true };
  }

  @Get(apiRoutes.AUTH.VERIFY_EMAIL)
  async verifyEmail(@Req() req: Request) {
    const token = req.query.token;

    if (typeof token !== 'string') {
      throw new BadRequestException('Verification token is missing or invalid');
    }

    const user = await this.authService.verifyEmail(token);

    return { user };
  }

  @Post(apiRoutes.AUTH.REFRESH)
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
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: AuthenticatedRequest): Promise<ProfileResponseDto> {
    const userId = req.user!.id;
    const user = await this.authService.getMe(userId);

    return user;
  }
}
