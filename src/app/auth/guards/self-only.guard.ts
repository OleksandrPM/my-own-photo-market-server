import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/types/authenticated-request';

@Injectable()
export class SelfOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // req.user is now fully typed because of your augmentation
    const userId = req.user.id;

    // You can decide where the target ID comes from:
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
