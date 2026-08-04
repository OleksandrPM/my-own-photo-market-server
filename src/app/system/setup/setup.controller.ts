import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SetupService } from './setup.service';
import { SetupEnabledGuard } from './guards/setup-enabled.guard';
import { SetupAdminDto } from './dto/setup-admin.dto';
import { apiRoutes } from 'src/app/common/path-builder/api.routes';
import { SetupVerifyEmailDto } from './dto/setup-verify-email.dto';
import { CookieService } from '../cookies/cookie.service';
import type { Request, Response } from 'express';
import { SetupIsEnabledResponseDto } from './dto/setup-is-enabled-response.dto';
import { CookieName } from '../cookies/cookies.types';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SetupStatusResponseDto } from './dto/setup-status-response.dto';
import { SetupCreatedminResponseDto } from './dto/setup-create-admin-response.dto';

@ApiTags('setup')
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
  async isSetupEnabled(): Promise<SetupIsEnabledResponseDto> {
    const response = await this.setupService.isSetupEnabled();

    return response;
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
  async verifyEmail(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: SetupVerifyEmailDto,
  ) {
    const { message, sessionId } =
      await this.setupService.verifyOwnerEmail(dto);

    this.cookieService.setSetupSessionCookie(res, sessionId);

    return { message };
  }

  // Confirm email (clicked from email), verify token and allow to proceed with setup
  @UseGuards(SetupEnabledGuard)
  @Get(apiRoutes.SETUP.CONFIRM_EMAIL)
  async confirmEmail(@Query('token') token: string) {
    const response = await this.setupService.confirmOwnerEmail(token);

    return response;
  }

  // Frontend polls for confirmation status
  @UseGuards(SetupEnabledGuard)
  @Get(apiRoutes.SETUP.STATUS)
  async getSetupStatus(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SetupStatusResponseDto> {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const sessionId = req.cookies?.[CookieName.SETUP_SESSION_ID];

    const response = await this.setupService.getStatus(sessionId);

    return response;
  }

  // Create the initial admin user after email confirmation
  @UseGuards(SetupEnabledGuard)
  @Post(apiRoutes.SETUP.INITIAL_ADMIN)
  async createAdmin(
    @Req() req: Request,
    @Body() dto: SetupAdminDto,
  ): Promise<SetupCreatedminResponseDto> {
    const sessionId = req.cookies?.[CookieName.SETUP_SESSION_ID];

    const response = await this.setupService.createInitialAdmin(dto, sessionId);

    return response;
  }
}
