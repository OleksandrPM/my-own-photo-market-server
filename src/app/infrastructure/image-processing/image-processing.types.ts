import { ImageFormat } from 'src/app/product/image/image.types';

export enum ImageMime {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  GIF = 'image/gif',
  WEBP = 'image/webp',
  AVIF = 'image/avif',
  TIFF = 'image/tiff',
  BMP = 'image/bmp',
  SVG = 'image/svg+xml',
  ICO = 'image/x-icon',
  HEIC = 'image/heic',
  HEIF = 'image/heif',
}

export type ProcessableImageFormat =
  | ImageFormat.JPG
  | ImageFormat.JPEG
  | ImageFormat.PNG
  | ImageFormat.WEBP
  | ImageFormat.AVIF
  | ImageFormat.TIFF;

export enum ImageFit {
  INSIDE = 'inside',
  COVER = 'cover',
  CONTAIN = 'contain',
}

export interface TextWatermark {
  text: string;
  opacity?: number;
}

export interface ImageWatermark {
  path: string;
  size?: number;
  opacity?: number;
}

export interface ImagePreset {
  width?: number;
  height?: number;
  quality?: number;
  fit?: ImageFit;
  format: ProcessableImageFormat;
  watermarkText?: TextWatermark;
  watermarkImage?: ImageWatermark;
}
