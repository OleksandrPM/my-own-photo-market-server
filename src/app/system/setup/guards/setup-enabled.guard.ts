import { CanActivate, Injectable } from '@nestjs/common';
import { ProfilesService } from 'src/app/product/profile/profile.service';

@Injectable()
export class SetupEnabledGuard implements CanActivate {
  constructor(private readonly profilesService: ProfilesService) {}

  async canActivate(): Promise<boolean> {
    const adminExists = await this.profilesService.existsAdmin();
    return !adminExists;
  }
}
