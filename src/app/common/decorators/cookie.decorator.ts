import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CookieName } from 'src/app/system/cookies/cookies.types';

export const Cookie = createParamDecorator(
  (cookieName: CookieName, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<Request>();

    const value = request.cookies[cookieName];

    if (!value) {
      throw new UnauthorizedException(`${cookieName} cookie not found`);
    }

    return value;
  },
);
