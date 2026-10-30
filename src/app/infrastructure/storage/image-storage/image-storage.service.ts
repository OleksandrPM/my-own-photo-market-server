import { Injectable } from '@nestjs/common';
import { R2Service } from '../r2/r2.service';
import { ImageProcessingService } from '../../image-processing/image-processing.service';
import {
  buildGalleryKey,
  buildPublicKey,
  buildSourceKey,
  buildThumbKey,
} from './image-storage.utils';
import {
  IMAGE_PRESETS,
  MIME_TO_FORMAT,
} from '../../image-processing/image-processing.constants';
import { ImageFormat } from 'src/app/product/image/image.types';
import { ImageMime } from '../../image-processing/image-processing.types';

@Injectable()
export class ImageStorageService {
  constructor(
    private readonly r2: R2Service,
    private readonly imageProcessing: ImageProcessingService,
  ) {}

  // Source image
  async uploadSourceImage(imageId: string, image: Express.Multer.File) {
    const imageMimeType = image.mimetype as ImageMime;

    const key = buildSourceKey(imageId, MIME_TO_FORMAT[imageMimeType]);
    await this.r2.uploadObject(key, image.buffer, image.mimetype);

    return key;
  }

  async deleteSourceImage(imageId: string, imageFormat: ImageFormat) {
    const key = buildSourceKey(imageId, imageFormat);
    await this.r2.deleteObject(key);
  }

  // Public image
  async uploadPublicImage(imageId: string, image: Express.Multer.File) {
    const resized = await this.imageProcessing.process(
      image.buffer,
      IMAGE_PRESETS.public,
    );

    const key = buildPublicKey(imageId);
    // TODO: Change string to actual content type of resized image
    await this.r2.uploadObject(key, resized, ImageMime.WEBP);

    return key;
  }

  async deletePublicImage(imageId: string) {
    const key = buildPublicKey(imageId);
    await this.r2.deleteObject(key);
  }

  // Gallery image
  async uploadGalleryImage(imageId: string, file: Express.Multer.File) {
    const resized = await this.imageProcessing.process(
      file.buffer,
      IMAGE_PRESETS.gallery,
    );
    const key = buildGalleryKey(imageId);
    await this.r2.uploadObject(key, resized, ImageMime.WEBP);
    return key;
  }

  async deleteGalleryImage(imageId: string) {
    const key = buildGalleryKey(imageId);
    await this.r2.deleteObject(key);
  }

  // Thumb image
  async uploadThumbImage(imageId: string, file: Express.Multer.File) {
    const resized = await this.imageProcessing.process(
      file.buffer,
      IMAGE_PRESETS.thumb,
    );
    const key = buildThumbKey(imageId);
    await this.r2.uploadObject(key, resized, ImageMime.WEBP);
    return key;
  }

  async deleteThumbImage(imageId: string) {
    const key = buildThumbKey(imageId);
    await this.r2.deleteObject(key);
  }

  async uploadImage(imageId: string, image: Express.Multer.File) {
    const [sourceKey, publicKey, galleryKey, thumbKey] = await Promise.all([
      this.uploadSourceImage(imageId, image),
      this.uploadPublicImage(imageId, image),
      this.uploadGalleryImage(imageId, image),
      this.uploadThumbImage(imageId, image),
    ]);

    return {
      sourceKey,
      publicKey,
      galleryKey,
      thumbKey,
    };
  }

  async deleteImage(imageId: string, imageFormat: ImageFormat) {
    await Promise.all([
      this.deleteSourceImage(imageId, imageFormat),
      this.deletePublicImage(imageId),
      this.deleteGalleryImage(imageId),
      this.deleteThumbImage(imageId),
    ]);

    return imageId;
  }
}
