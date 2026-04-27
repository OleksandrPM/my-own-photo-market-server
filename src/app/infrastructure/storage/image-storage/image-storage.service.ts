import { Injectable } from '@nestjs/common';
import { R2Service } from '../r2/r2.service';
import { ImageProcessingService } from '../../image-processing/image-processing.service';
import { IMAGE_PRESETS } from '../../image-processing/image-preset.interface';
import {
  buildOriginalKey,
  buildPreviewKey,
  buildThumbKey,
} from './image-storage.utils';
import {
  ImageExtension,
  ImageMime,
} from '../../image-processing/image-processing.constants';
import { getImageExtension } from '../../image-processing/image-processing.utils';

@Injectable()
export class ImageStorageService {
  constructor(
    private readonly r2: R2Service,
    private readonly imageProcessing: ImageProcessingService,
  ) {}

  // TODO: Check what the file originalname can be and refactor key building
  async uploadOriginalImage(image: Express.Multer.File) {
    const originalName = image.originalname;
    const imageMimeType = image.mimetype as ImageMime;
    const imageExtension = getImageExtension(imageMimeType);

    const key = buildOriginalKey(originalName, imageExtension);
    await this.r2.uploadObject(key, image.buffer, image.mimetype);

    return key;
  }

  async deleteOriginalImage(imageName: string, imageExtension: ImageExtension) {
    const key = buildOriginalKey(imageName, imageExtension);
    await this.r2.deleteObject(key);
  }

  async uploadPreviewImage(image: Express.Multer.File) {
    const resized = await this.imageProcessing.process(
      image.buffer,
      IMAGE_PRESETS.preview,
    );

    const key = buildPreviewKey(image.originalname);
    // TODO: Change string to actual content type of resized image
    await this.r2.uploadObject(key, resized, ImageMime.WEBP);

    return key;
  }

  async deletePreviewImage(imageName: string) {
    const key = buildPreviewKey(imageName);
    await this.r2.deleteObject(key);
  }

  async uploadThumbImage(file: Express.Multer.File) {
    const resized = await this.imageProcessing.process(
      file.buffer,
      IMAGE_PRESETS.thumb,
    );
    const key = buildThumbKey(file.originalname);
    await this.r2.uploadObject(key, resized, ImageMime.WEBP);
    return key;
  }

  async deleteThumbImage(imageName: string) {
    const key = buildThumbKey(imageName);
    await this.r2.deleteObject(key);
  }

  async uploadImage(image: Express.Multer.File) {
    const [originalKey, previewKey, thumbKey] = await Promise.all([
      this.uploadOriginalImage(image),
      this.uploadPreviewImage(image),
      this.uploadThumbImage(image),
    ]);

    return {
      originalKey,
      previewKey,
      thumbKey,
    };
  }

  async deleteImage(imageName: string, imageExtension: ImageExtension) {
    await Promise.all([
      this.deleteOriginalImage(imageName, imageExtension),
      this.deletePreviewImage(imageName),
      this.deleteThumbImage(imageName),
    ]);

    return imageName;
  }
}
