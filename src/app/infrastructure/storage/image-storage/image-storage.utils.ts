import { ImageExtension } from '../../image-processing/image-processing.constants';
import { StorageFolder, ImagesSubFolder } from '../storage-paths';

export function buildAvatarKey(
  userId: number,
  ext: ImageExtension = 'webp',
): string {
  return `${StorageFolder.USERS}/${userId}/avatar.${ext}`;
}

export function buildOriginalKey(
  imageName: string,
  ext: ImageExtension,
): string {
  return `${StorageFolder.IMAGES}/${ImagesSubFolder.ORIGINALS}/${imageName}.${ext}`;
}

export function buildPreviewKey(
  imageName: string,
  ext: ImageExtension = 'webp',
): string {
  return `${StorageFolder.IMAGES}/${ImagesSubFolder.PREVIEWS}/${imageName}.${ext}`;
}

export function buildThumbKey(
  imageName: string,
  ext: ImageExtension = 'webp',
): string {
  return `${StorageFolder.IMAGES}/${ImagesSubFolder.THUMBS}/${imageName}.${ext}`;
}
