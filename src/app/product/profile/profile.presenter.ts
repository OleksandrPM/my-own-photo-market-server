import { Injectable } from '@nestjs/common';
import { AvatarStorageService } from 'src/app/infrastructure/storage/image-storage/avatar-storage.service';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { ProfileEntity } from './entities/profile.entity';

@Injectable()
export class ProfilePresenter {
  constructor(private readonly avatarStorage: AvatarStorageService) {}

  async toDto(user: ProfileEntity): Promise<ProfileResponseDto> {
    const avatarUrl = await this.avatarStorage.getAvatarUrl(user.id);

    return ProfileResponseDto.fromDomain(user, avatarUrl);
  }
}
