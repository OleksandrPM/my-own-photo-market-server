import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
    const request = context.switchToHttp().getRequest();
    const origin = request.headers.origin;
    const referer = request.headers.referer;

    if (origin && this.allowedOrigins.includes(origin)) return true;
    if (referer && this.allowedOrigins.some((a) => referer.startsWith(a)))
      return true;

    throw new ForbiddenException('Access denied');
  }
}
