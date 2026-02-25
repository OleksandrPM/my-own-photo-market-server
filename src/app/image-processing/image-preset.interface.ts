export interface ImagePreset {
  width?: number;
  format?: 'webp' | 'jpeg' | 'png';
  watermarkText?: {
    text: string;
    opacity?: number;
  };
  watermarkImage?: {
    path: string;
    size?: number;
    opacity?: number;
  };
}

export const IMAGE_PRESETS: Record<string, ImagePreset> = {
  avatar: { width: 256, format: 'webp' },
  preview: {
    width: 1024,
    format: 'webp',
  },
  thumb: {
    width: 320,
    format: 'webp',
  },
  banner: {
    width: 1920,
    format: 'webp',
  },
  textWatermarked: {
    width: 1280,
    format: 'webp',
    watermarkText: {
      text: 'My Own Photo Market',
      opacity: 0.4,
    },
  },
  imageWatermarked: {
    width: 1280,
    format: 'webp',
    watermarkImage: {
      path: './assets/watermark.png',
      size: 128,
      opacity: 0.6,
    },
  },
};
