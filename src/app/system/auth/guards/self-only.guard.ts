import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class SelfOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();

    // Check if the user is authenticated
    if (!req.user) {
      throw new UnauthorizedException('Authentication required');
    }

    const targetId = req.params.id ?? req.body.id ?? req.query.id;

    // Check if the target ID is provided and matches the authenticated user's ID
    if (!targetId) {
      throw new BadRequestException('Target user ID missing');
    }

    // Check if the authenticated user is trying to access their own data
    if (String(targetId) !== String(req.user.id)) {
      throw new ForbiddenException('You can only access your own data');
    }

    return true;
  }
}
