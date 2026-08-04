import { BadRequestException, Injectable } from '@nestjs/common';
import sharp from 'sharp';
import {
  IMAGE_PRESETS,
  ImagePreset,
  ImagePresetName,
} from './image-preset.interface';
import { ERROR_CODES } from 'src/types/error.types';

@Injectable()
export class ImageProcessingService {
  async process(
    buffer: Buffer,
    presetOrConfig: ImagePresetName | ImagePreset,
  ): Promise<Buffer> {
    const config =
      typeof presetOrConfig === 'string'
        ? IMAGE_PRESETS[presetOrConfig]
        : presetOrConfig;

    if (!config) {
      throw new BadRequestException({
        code: ERROR_CODES.BAD_REQUEST,
        message: 'Unknown image preset',
      });
    }

    let pipeline = sharp(buffer);

    // Resize
    if (config.width) {
      pipeline = pipeline.resize({
        width: config.width,
        fit: 'inside',
      });
    }

    // Format
    if (config.format) {
      pipeline = pipeline.toFormat(config.format);
    }

    // Text watermark
    if (config.watermarkText) {
      const safeText = config.watermarkText.text.replace(/[<>&'"]/g, '');

      const svg = `
        <svg width="100%" height="100%">
          <text x="95%" y="95%"
                font-size="32"
                fill="white"
                opacity="${config.watermarkText.opacity ?? 0.5}"
                text-anchor="end"
                font-family="Arial, sans-serif">
            ${safeText}
          </text>
        </svg>
      `;

      pipeline = pipeline.composite([
        { input: Buffer.from(svg), gravity: 'southeast' },
      ]);
    }

    // Image watermark
    if (config.watermarkImage) {
      const wm = await sharp(config.watermarkImage.path)
        .resize(config.watermarkImage.size ?? 128)
        .ensureAlpha()
        .linear([1, config.watermarkImage.opacity ?? 0.6])
        .png()
        .toBuffer();

      pipeline = pipeline.composite([
        { input: wm, gravity: 'southeast', blend: 'over' },
      ]);
    }

    return pipeline.toBuffer();
  }
}
