import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{
      user: { id: number; role: UserRole; email: string };
      params: { id?: string; email?: string };
    }>();

    const user = req.user;

    // If route uses :id
    if (req.params.id) {
      const paramId = Number(req.params.id);
      return user.role === UserRole.ADMIN || user.id === paramId;
    }

    // If route uses :email
    if (req.params.email) {
      return user.role === UserRole.ADMIN || user.email === req.params.email;
    }

    return false;
  }
}
