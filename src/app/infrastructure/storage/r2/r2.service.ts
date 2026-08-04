import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ERROR_CODES } from 'src/types/error.types';

@Injectable()
export class R2Service {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly cdnBaseUrl: string;

  constructor(private readonly config: ConfigService) {
    const accountId = this.config.get<string>('R2_ACCOUNT_ID');
    const accessKeyId = this.config.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get<string>('R2_SECRET_ACCESS_KEY');
    const bucket = this.config.get<string>('R2_BUCKET');
    const cdnBaseUrl = this.config.get<string>('R2_CDN_URL');

    if (
      !accountId ||
      !accessKeyId ||
      !secretAccessKey ||
      !bucket ||
      !cdnBaseUrl
    ) {
      throw new Error('Storage service is not configured properly');
    }

    this.bucket = bucket;
    this.cdnBaseUrl = cdnBaseUrl;
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadObject(
    key: string,
    body: Buffer | Uint8Array | string,
    contentType: string,
  ): Promise<string> {
    if (!key || key.includes('..')) {
      throw new BadRequestException({
        code: ERROR_CODES.BAD_REQUEST,
        message: 'Invalid object key',
      });
    }

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
          CacheControl: 'public, max-age=31536000',
        }),
      );

      return key;
    } catch {
      throw new InternalServerErrorException({
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Failed to upload object',
      });
    }
  }

  async getObject(key: string) {
    const res = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );

    if (!res.Body) {
      throw new NotFoundException({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Object not found',
      });
    }

    return {
      stream: res.Body as NodeJS.ReadableStream,
      contentType: res.ContentType,
      contentLength: res.ContentLength,
    };
  }

  async deleteObject(key: string): Promise<string> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );

    return key;
  }

  async createSignedUrl(
    key: string,
    expiresInSeconds: number,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
  }

  getPublicUrl(key: string): string {
    return `${this.cdnBaseUrl}/${key}`;
  }
}
