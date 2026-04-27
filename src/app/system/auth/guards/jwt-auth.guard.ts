import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfilesService } from 'src/app/product/profiles/profiles.service';
import { AuthenticatedRequest } from 'src/types/authenticated-request.types';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly profilesService: ProfilesService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const can = await super.canActivate(context);
    if (!can) return false;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.user?.id) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    const userId = Number(request.user.id);

    const user = await this.profilesService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    request.user = {
      id: String(user.id),
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };

    return true;
  }
}
