import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/types/authenticated-request.types';

@Injectable()
export class SelfOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // Check if the user is authenticated
    if (!req.user) {
      throw new ForbiddenException('Authentication required');
    }

    const userId = req.user.id;

    const targetId = req.params.id ?? req.body.id ?? req.query.id;

    if (!targetId) {
      throw new ForbiddenException('Target user ID missing');
    }

    if (String(targetId) !== String(userId)) {
      throw new ForbiddenException('You can only access your own data');
    }

    return true;
  }
}
