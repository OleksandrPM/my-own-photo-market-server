import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Reflector } from '@nestjs/core';
import { CookieService } from 'src/app/system/cookies/cookie.service';
import { TokenManagerService } from 'src/app/system/tokens/tokens-manager.service';
import { CookieName } from 'src/app/system/cookies/cookies.types';
import { ERROR_CODES } from 'src/types/error.types';
import { SKIP_CSRF_KEY } from '../decorators/skip-csrf.decorator';

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenManagerService,
    private readonly reflector: Reflector,
    private readonly cookieService: CookieService,
  ) {}

  private isSafeMethod(method: string): boolean {
    return ['GET', 'HEAD', 'OPTIONS'].includes(method);
  }

  private shouldRefreshToken(): boolean {
    // ~10% chance of refresh (to avoid updating on every request)
    return Math.random() < 0.1;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();

    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    // Skip CSRF check if @SkipCsrf() is present
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_CSRF_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skip) return true;

    // Safe methods don't require CSRF validation
    if (this.isSafeMethod(req.method)) {
      return true;
    }

    const deviceId = req.cookies?.[CookieName.DEVICE_ID];
    const csrfHeader = req.get('x-csrf-token');

    // Base validation: both device_id cookie and x-csrf-token header must be present
    if (!deviceId || !csrfHeader) {
      throw new ForbiddenException({
        code: ERROR_CODES.FORBIDDEN,
        message: 'CSRF token missing',
      });
    }

    // Validation: check if the provided CSRF token is valid for the given device ID
    const isValid = await this.tokenService.validateCsrfToken(
      csrfHeader,
      deviceId,
    );

    if (!isValid) {
      throw new ForbiddenException({
        code: ERROR_CODES.FORBIDDEN,
        message: 'Invalid CSRF token',
      });
    }

    // Update CSRF token with a certain probability to enhance security (e.g., ~10% of requests)
    const shouldRefresh = this.shouldRefreshToken();

    if (shouldRefresh) {
      const newToken = await this.tokenService.generateCsrfToken(deviceId);
      this.cookieService.setCsrfCookie(res, newToken);
    }

    return true;
  }
}
