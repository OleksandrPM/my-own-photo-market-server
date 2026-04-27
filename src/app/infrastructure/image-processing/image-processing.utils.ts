import { ImageExtension, ImageMime } from './image-processing.constants';

export const mimeToExtensionMap: Record<ImageMime, ImageExtension> = {
  [ImageMime.JPEG]: 'jpg',
  [ImageMime.PNG]: 'png',
  [ImageMime.WEBP]: 'webp',
  [ImageMime.AVIF]: 'avif',
};

export function getImageExtension(mime: ImageMime): ImageExtension {
  return mimeToExtensionMap[mime] ?? 'bin';
}
