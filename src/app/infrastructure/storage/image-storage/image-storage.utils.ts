import { ImageFormat, ImageName } from 'src/app/product/image/image.types';
import { StorageFolder } from '../storage-paths';

export function buildAvatarKey(
  userId: number,
  ext: ImageFormat = ImageFormat.WEBP,
): string {
  return `${StorageFolder.PROFILES}/${userId}/avatar.${ext}`;
}

export function buildImageKey(
  imageId: string,
  imageName: ImageName,
  ext: ImageFormat,
): string {
  return `${StorageFolder.IMAGES}/${imageId}/${imageName}.${ext}`;
}

export function buildSourceKey(imageId: string, ext: ImageFormat): string {
  return buildImageKey(imageId, ImageName.SOURCE, ext);
}

export function buildPublicKey(
  imageId: string,
  ext: ImageFormat = ImageFormat.WEBP,
): string {
  return buildImageKey(imageId, ImageName.PUBLIC, ext);
}

export function buildGalleryKey(
  imageId: string,
  ext: ImageFormat = ImageFormat.WEBP,
): string {
  return buildImageKey(imageId, ImageName.GALLERY, ext);
}

export function buildThumbKey(
  imageId: string,
  ext: ImageFormat = ImageFormat.WEBP,
): string {
  return buildImageKey(imageId, ImageName.THUMB, ext);
}
