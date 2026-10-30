import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { CookieService } from 'src/app/system/cookie/cookie.service';
import { TokenManagerService } from 'src/app/system/token/token-manager.service';
import { CookieName } from 'src/app/system/cookie/cookie.types';

@Injectable()
export class InitCookiesMiddleware implements NestMiddleware {
  constructor(
    private readonly tokenService: TokenManagerService,
    private readonly cookieService: CookieService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    let deviceId = req.cookies?.[CookieName.DEVICE_ID];

    // 1. Device ID
    if (!deviceId) {
      deviceId = randomUUID();
      this.cookieService.setCookie(res, CookieName.DEVICE_ID, deviceId);
      req.cookies[CookieName.DEVICE_ID] = deviceId;
    }

    // 2. CSRF
    const csrfCookie = req.cookies?.[CookieName.CSRF_TOKEN];

    if (!csrfCookie) {
      const csrfToken = this.tokenService.generateCsrfToken(deviceId);

      this.cookieService.setCookie(res, CookieName.CSRF_TOKEN, csrfToken);

      req.cookies[CookieName.CSRF_TOKEN] = csrfToken;
    }

    next();
  }
}
