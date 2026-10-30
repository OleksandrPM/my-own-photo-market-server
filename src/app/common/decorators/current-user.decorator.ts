import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedUser } from 'src/app/system/auth/auth.types';

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext): AuthenticatedUser => {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.user) {
      throw new UnauthorizedException('User not found');
    }

    return request.user;
  },
);
