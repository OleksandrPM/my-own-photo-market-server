import { ImageFormat } from 'src/app/product/image/image.types';
import {
  ImageFit,
  ImageMime,
  ImagePreset,
  ImageWatermark,
  TextWatermark,
} from './image-processing.types';

export const IMAGE_MIME_BY_FORMAT: Record<ImageFormat, ImageMime> = {
  [ImageFormat.JPG]: ImageMime.JPEG,
  [ImageFormat.JPEG]: ImageMime.JPEG,
  [ImageFormat.PNG]: ImageMime.PNG,
  [ImageFormat.WEBP]: ImageMime.WEBP,
  [ImageFormat.TIFF]: ImageMime.TIFF,
  [ImageFormat.SVG]: ImageMime.SVG,
  [ImageFormat.GIF]: ImageMime.GIF,
  [ImageFormat.AVIF]: ImageMime.AVIF,
  [ImageFormat.BMP]: ImageMime.BMP,
  [ImageFormat.ICO]: ImageMime.ICO,
  [ImageFormat.HEIC]: ImageMime.HEIC,
  [ImageFormat.HEIF]: ImageMime.HEIF,
};

export const MIME_TO_FORMAT: Record<ImageMime, ImageFormat> = {
  [ImageMime.JPEG]: ImageFormat.JPG,
  [ImageMime.PNG]: ImageFormat.PNG,
  [ImageMime.GIF]: ImageFormat.GIF,
  [ImageMime.WEBP]: ImageFormat.WEBP,
  [ImageMime.AVIF]: ImageFormat.AVIF,
  [ImageMime.TIFF]: ImageFormat.TIFF,
  [ImageMime.BMP]: ImageFormat.BMP,
  [ImageMime.SVG]: ImageFormat.SVG,
  [ImageMime.ICO]: ImageFormat.ICO,
  [ImageMime.HEIC]: ImageFormat.HEIC,
  [ImageMime.HEIF]: ImageFormat.HEIF,
};

export const DEFAULT_TEXT_WATERMARK = {
  text: 'My Own Photo Market',
  opacity: 0.4,
} satisfies TextWatermark;

export const DEFAULT_IMAGE_WATERMARK = {
  path: './assets/watermark.png',
  size: 128,
  opacity: 0.6,
} satisfies ImageWatermark;

export const IMAGE_PRESETS = {
  avatar: {
    width: 256,
    fit: ImageFit.COVER,
    quality: 80,
    format: ImageFormat.WEBP,
  },

  public: {
    width: 1920,
    quality: 82,
    format: ImageFormat.WEBP,
    watermarkImage: DEFAULT_IMAGE_WATERMARK,
  },

  gallery: {
    width: 1024,
    quality: 78,
    format: ImageFormat.WEBP,
    watermarkImage: DEFAULT_IMAGE_WATERMARK,
  },

  thumb: {
    width: 384,
    height: 384,
    fit: ImageFit.COVER,
    quality: 75,
    format: ImageFormat.WEBP,
  },
} satisfies Record<string, ImagePreset>;

export type ImagePresetName = keyof typeof IMAGE_PRESETS;
