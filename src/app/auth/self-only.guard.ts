import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SelfOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{
      user: { id: User['id'] };
      params: { id: string };
    }>();

    return req.user.id === Number(req.params.id);
  }
}
