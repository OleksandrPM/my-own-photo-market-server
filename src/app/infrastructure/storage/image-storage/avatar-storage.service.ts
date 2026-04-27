import { Injectable } from '@nestjs/common';
import { R2Service } from '../r2/r2.service';
import { ImageProcessingService } from '../../image-processing/image-processing.service';
import { IMAGE_PRESETS } from '../../image-processing/image-preset.interface';
import { buildAvatarKey } from './image-storage.utils';
import { ImageMime } from '../../image-processing/image-processing.constants';

@Injectable()
export class AvatarStorageService {
  constructor(
    private readonly r2: R2Service,
    private readonly imageProcessing: ImageProcessingService,
  ) {}

  async getAvatarUrlByUserId(userId: number): Promise<string> {
    const key = buildAvatarKey(userId);

    return this.r2.createSignedUrl(key, 3600); // URL valid for 1 hour
  }

  async getAvatarUrl(avatarKey: string): Promise<string> {
    return this.r2.createSignedUrl(avatarKey, 3600); // URL valid for 1 hour
  }

  async uploadAvatar(
    userId: number,
    file: Express.Multer.File,
  ): Promise<string> {
    const resized = await this.imageProcessing.process(
      file.buffer,
      IMAGE_PRESETS.avatar,
    );

    const key = buildAvatarKey(userId);

    return this.r2.uploadObject(key, resized, ImageMime.WEBP);
  }

  async deleteAvatarByUserId(userId: number): Promise<string> {
    const key = buildAvatarKey(userId);

    return this.r2.deleteObject(key);
  }

  async deleteAvatarByKey(avatarKey: string): Promise<string> {
    return this.r2.deleteObject(avatarKey);
  }
}
