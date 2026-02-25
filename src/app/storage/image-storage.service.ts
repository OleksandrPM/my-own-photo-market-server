import { Injectable } from '@nestjs/common';
import { R2Service } from '../r2/r2.service';
import { ImageProcessingService } from '../image-processing/image-processing.service';
import { IMAGE_PRESETS } from '../image-processing/image-preset.interface';
import {
  buildAvatarKey,
  buildOriginalKey,
  buildPreviewKey,
  buildThumbKey,
} from './storage.utils';

@Injectable()
export class ImageStorageService {
  constructor(
    private readonly r2: R2Service,
    private readonly imageProcessing: ImageProcessingService,
  ) {}

  async uploadAvatar(
    userId: number,
    file: Express.Multer.File,
  ): Promise<string> {
    const resized = await this.imageProcessing.process(
      file.buffer,
      IMAGE_PRESETS.avatar,
    );

    const key = buildAvatarKey(userId);

    // TODO: Change string to actual content type of resized image
    return this.r2.uploadObject(key, resized, 'image/webp');
  }

  async deleteAvatar(userId: number): Promise<string> {
    const key = buildAvatarKey(userId);
    return this.r2.deleteObject(key);
  }

  // TODO: Check what the file originalname can be and refactor key building
  async uploadOriginal(file: Express.Multer.File) {
    const key = buildOriginalKey(
      file.originalname,
      file.mimetype.split('/')[1],
    );
    await this.r2.uploadObject(key, file.buffer, file.mimetype);

    return key;
  }

  async deleteOriginal(fileName: string, fileType: string) {
    const key = buildOriginalKey(fileName, fileType);
    await this.r2.deleteObject(key);
  }

  async uploadPreview(file: Express.Multer.File) {
    const resized = await this.imageProcessing.process(
      file.buffer,
      IMAGE_PRESETS.preview,
    );

    const key = buildPreviewKey(file.originalname);
    // TODO: Change string to actual content type of resized image
    await this.r2.uploadObject(key, resized, 'image/webp');

    return key;
  }

  async deletePreview(fileName: string) {
    const key = buildPreviewKey(fileName);
    await this.r2.deleteObject(key);
  }

  async uploadThumb(file: Express.Multer.File) {
    const resized = await this.imageProcessing.process(
      file.buffer,
      IMAGE_PRESETS.thumb,
    );
    const key = buildThumbKey(file.originalname);
    await this.r2.uploadObject(key, resized, 'image/webp');
    return key;
  }

  async deleteThumb(fileName: string) {
    const key = buildThumbKey(fileName);
    await this.r2.deleteObject(key);
  }

  async uploadImage(file: Express.Multer.File) {
    const [originalKey, previewKey, thumbKey] = await Promise.all([
      this.uploadOriginal(file),
      this.uploadPreview(file),
      this.uploadThumb(file),
    ]);
    return {
      originalKey,
      previewKey,
      thumbKey,
    };
  }

  async deleteImage(fileName: string, fileType: string) {
    await Promise.all([
      this.deleteOriginal(fileName, fileType),
      this.deletePreview(fileName),
      this.deleteThumb(fileName),
    ]);

    return fileName;
  }
}
