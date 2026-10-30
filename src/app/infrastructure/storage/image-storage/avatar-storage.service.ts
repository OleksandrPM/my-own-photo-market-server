import { Injectable } from '@nestjs/common';
import { R2Service } from '../r2/r2.service';
import { ImageProcessingService } from '../../image-processing/image-processing.service';
import { buildAvatarKey } from './image-storage.utils';
import { IMAGE_PRESETS } from '../../image-processing/image-processing.constants';
import { ImageMime } from '../../image-processing/image-processing.types';

@Injectable()
export class AvatarStorageService {
  constructor(
    private readonly r2: R2Service,
    private readonly imageProcessing: ImageProcessingService,
  ) {}

  async getAvatarUrl(userId: number): Promise<string> {
    return this.r2.createSignedUrl(buildAvatarKey(userId), 3600);
  }

  async uploadAvatar(
    userId: number,
    file: Express.Multer.File,
  ): Promise<string> {
    const resized = await this.imageProcessing.process(
      file.buffer,
      IMAGE_PRESETS.avatar,
    );

    return this.r2.uploadObject(
      buildAvatarKey(userId),
      resized,
      ImageMime.WEBP,
    );
  }

  async deleteAvatar(userId: number): Promise<void> {
    await this.r2.deleteObject(buildAvatarKey(userId));
  }
}
