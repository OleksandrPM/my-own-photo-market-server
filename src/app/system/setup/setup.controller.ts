import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { SetupService } from './setup.service';
import { SetupEnabledGuard } from './guards/setup-enabled.guard';
import { SetupAdminDto } from './dto/setup-admin.dto';
import { apiRoutes } from 'src/app/common/path-builder/api.routes';
import { SetupVerifyEmailDto } from './dto/setup-verify-email.dto';
import { randomUUID } from 'crypto';
import { CookieService } from '../cookies/cookie.service';
import type { Request, Response } from 'express';
import { SetupIsEnabledResponseDto } from './dto/setup-is-enabled-response.dto';
import { CookieName } from '../cookies/cookies.types';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class SetupController {
  constructor(
    private readonly setupService: SetupService,
    private readonly cookieService: CookieService,
  ) {}

  // Check if the setup process should be initiated
  @Get(apiRoutes.SETUP.ENABLED)
  @ApiOperation({ summary: 'Check if setup flow is enabled' })
  @ApiOkResponse({
    type: SetupIsEnabledResponseDto,
    description: 'Indicates if setup flow is enabled',
    example: { isSetupEnabled: true },
  })
  async isSetupEnabled(
    @Res({ passthrough: true }) res: Response,
  ): Promise<SetupIsEnabledResponseDto> {
    const { isSetupEnabled } = await this.setupService.isSetupEnabled();

    if (isSetupEnabled) {
      const deviceId = randomUUID();
      this.cookieService.setDeviceIdCookie(res, deviceId);
    }

    return { isSetupEnabled };
  }

  // Verify owner`s email and send setup token
  @UseGuards(SetupEnabledGuard)
  @Post(apiRoutes.SETUP.VERIFY_EMAIL)
  @ApiOperation({ summary: 'Start setup by verifying owner email' })
  @ApiBody({
    type: SetupVerifyEmailDto,
    description: 'Owner email address to verify and send setup token to',
    schema: {
      example: { email: 'owner@example.com' },
    },
  })
  @ApiOkResponse({
    description: 'Setup email sent successfully',
  })
  async confirmEmail(@Req() req: Request, @Body() dto: SetupVerifyEmailDto) {
    const deviceId = req.cookies?.[CookieName.DEVICE_ID];

    if (!deviceId) {
      throw new UnauthorizedException('Device ID missing');
    }

    return this.setupService.sendSetupEmail(dto, deviceId);
  }

  // Confirm email (clicked from email), verify token and allow to proceed with setup
  @UseGuards(SetupEnabledGuard)
  @Get(apiRoutes.SETUP.CONFIRM_EMAIL)
  async confirmToken(@Param('token') token: string) {
    return this.setupService.confirmOwnerEmail(token);
  }

  // Frontend polls for confirmation status
  @UseGuards(SetupEnabledGuard)
  @Get(apiRoutes.SETUP.STATUS)
  async getSetupStatus(@Req() req: Request, @Body() email: string) {
    const deviceId = req.cookies?.[CookieName.DEVICE_ID];

    if (!deviceId) {
      throw new UnauthorizedException('Device ID missing');
    }

    return this.setupService.isOwnerEmailConfirmed(email, deviceId);
  }

  // Create the initial admin user after email confirmation
  @UseGuards(SetupEnabledGuard)
  @Post(apiRoutes.SETUP.INITIAL_ADMIN)
  async createAdmin(@Req() req: Request, @Body() dto: SetupAdminDto) {
    const deviceId = req.cookies?.[CookieName.DEVICE_ID];

    if (!deviceId) {
      throw new UnauthorizedException('Device ID missing');
    }

    return this.setupService.createInitialAdmin(dto, deviceId);
  }
}
