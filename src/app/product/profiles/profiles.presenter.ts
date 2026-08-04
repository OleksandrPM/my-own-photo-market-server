import { Injectable, Logger } from '@nestjs/common';
import { AvatarStorageService } from 'src/app/infrastructure/storage/image-storage/avatar-storage.service';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { UserEntity } from './entities/user.entity';
import {
  Warning,
  WarningCode,
  warningService,
} from 'src/app/common/warning/warning.service';
import { WarningCollector } from 'src/app/common/warning/warning.collector';

@Injectable()
export class ProfilePresenter {
  private readonly logger = new Logger(ProfilePresenter.name);
  private readonly warnings = warningService;

  constructor(private readonly avatarStorage: AvatarStorageService) {}

  async toDtoWithWarnings(user: UserEntity): Promise<{
    dto: ProfileResponseDto;
    warnings?: Warning[];
  }> {
    let avatarUrl: string | null = null;
    const warnings = new WarningCollector();

    if (user.avatarKey) {
      try {
        avatarUrl = await this.avatarStorage.getAvatarUrlByKey(user.avatarKey);
      } catch (e) {
        this.logger.warn(
          `Avatar URL resolve failed`,
          JSON.stringify({ userId: user.id, avatarKey: user.avatarKey }),
          e instanceof Error ? e.stack : undefined,
        );
        warnings.add(
          this.warnings.create(WarningCode.AVATAR_URL_RESOLVE_FAILED),
        );
      }
    }

    return {
      dto: ProfileResponseDto.fromDomain(user, avatarUrl),
      ...(warnings.hasAny() ? { warnings: warnings.getAll() } : {}),
    };
  }

  async toDto(user: UserEntity): Promise<ProfileResponseDto> {
    const { dto } = await this.toDtoWithWarnings(user);

    return dto;
  }
}
