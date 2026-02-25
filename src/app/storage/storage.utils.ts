import { ImagesSubFolder, StorageFolder } from './storage.constants';

export function buildAvatarKey(userId: number): string {
  return `${StorageFolder.USERS}/${userId}/avatar.webp`;
}

export function buildOriginalKey(imageName: string, ext: string): string {
  return `${StorageFolder.IMAGES}/${ImagesSubFolder.ORIGINALS}/${imageName}.${ext}`;
}

export function buildPreviewKey(imageName: string): string {
  return `${StorageFolder.IMAGES}/${ImagesSubFolder.PREVIEWS}/${imageName}.webp`;
}

export function buildThumbKey(imageName: string): string {
  return `${StorageFolder.IMAGES}/${ImagesSubFolder.THUMBS}/${imageName}.webp`;
}

export function getExtension(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };

  return map[mime] ?? 'bin';
}
