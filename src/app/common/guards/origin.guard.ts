import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ERROR_CODES } from 'src/types/error.types';

@Injectable()
export class OriginGuard implements CanActivate {
  private readonly allowedOrigins: string[];

  constructor(private readonly config: ConfigService) {
    this.allowedOrigins = [
      this.config.get<string>('ORIGIN_URL'),
      'http://localhost:3000',
    ].filter((v): v is string => typeof v === 'string');
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return true;
    }

    const origin = request.get('origin');
    const referer = request.get('referer');

    const isAllowedOrigin = origin
      ? this.allowedOrigins.includes(origin)
      : false;

    let isAllowedReferer = false;

    if (referer) {
      try {
        const refererOrigin = new URL(referer).origin;
        isAllowedReferer = this.allowedOrigins.includes(refererOrigin);
      } catch {
        isAllowedReferer = false;
      }
    }

    if (isAllowedOrigin || isAllowedReferer) {
      return true;
    }

    throw new ForbiddenException({
      code: ERROR_CODES.FORBIDDEN,
      message: 'Access denied',
    });
  }
}
