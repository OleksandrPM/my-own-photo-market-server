import sharp from 'sharp';
import { ProcessableImageFormat } from './image-processing.types';
import { ImageFormat } from 'src/app/product/image/image.types';

export const FORMAT_HANDLERS = {
  [ImageFormat.JPG]: (p: sharp.Sharp, q?: number) => p.jpeg({ quality: q }),

  [ImageFormat.JPEG]: (p: sharp.Sharp, q?: number) => p.jpeg({ quality: q }),

  [ImageFormat.PNG]: (p: sharp.Sharp) => p.png(),

  [ImageFormat.WEBP]: (p: sharp.Sharp, q?: number) => p.webp({ quality: q }),

  [ImageFormat.AVIF]: (p: sharp.Sharp, q?: number) => p.avif({ quality: q }),

  [ImageFormat.TIFF]: (p: sharp.Sharp, q?: number) => p.tiff({ quality: q }),
} satisfies Record<
  ProcessableImageFormat,
  (p: sharp.Sharp, q?: number) => sharp.Sharp
>;
