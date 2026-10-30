import { BadRequestException, Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { ImageFit, ImagePreset } from './image-processing.types';
import { ERROR_CODES } from 'src/types/error.types';
import { IMAGE_PRESETS, ImagePresetName } from './image-processing.constants';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { FORMAT_HANDLERS } from './format-handlers';

@Injectable()
export class ImageProcessingService {
  private watermarkBuffer?: Buffer;

  private readonly watermarkPath = join(
    process.cwd(),
    'assets',
    'watermark.png',
  );

  private async getWatermarkBuffer(): Promise<Buffer> {
    if (!this.watermarkBuffer) {
      this.watermarkBuffer = await readFile(this.watermarkPath);
    }

    return this.watermarkBuffer;
  }

  private resolvePreset(
    presetOrConfig: ImagePresetName | ImagePreset,
  ): ImagePreset {
    return typeof presetOrConfig === 'string'
      ? IMAGE_PRESETS[presetOrConfig]
      : presetOrConfig;
  }

  async process(
    buffer: Buffer,
    presetOrConfig: ImagePresetName | ImagePreset,
  ): Promise<Buffer> {
    const config = this.resolvePreset(presetOrConfig);

    let pipeline = sharp(buffer);

    if (config.width || config.height) {
      pipeline = pipeline.resize({
        width: config.width,
        height: config.height,
        fit: config.fit ?? ImageFit.INSIDE,
        withoutEnlargement: true,
      });
    }

    if (config.watermarkText) {
      const safeText = config.watermarkText.text.replace(/[<>&'"]/g, '');

      const svg = `
        <svg width="100%" height="100%">
          <text
            x="95%"
            y="95%"
            font-size="32"
            fill="white"
            opacity="${config.watermarkText.opacity ?? 0.5}"
            text-anchor="end"
            font-family="Arial, sans-serif"
          >
            ${safeText}
          </text>
        </svg>
      `;

      pipeline = pipeline.composite([
        {
          input: Buffer.from(svg),
          gravity: 'southeast',
        },
      ]);
    }

    if (config.watermarkImage) {
      const watermarkBuffer = await this.getWatermarkBuffer();

      const watermark = await sharp(watermarkBuffer)
        .resize(config.watermarkImage.size ?? 128)
        .ensureAlpha()
        .linear([1, config.watermarkImage.opacity ?? 0.6])
        .png()
        .toBuffer();

      pipeline = pipeline.composite([
        {
          input: watermark,
          gravity: 'southeast',
          blend: 'over',
        },
      ]);
    }

    pipeline = FORMAT_HANDLERS[config.format](pipeline, config.quality);

    return pipeline.toBuffer();
  }
}
