import { Module } from '@nestjs/common';
import { R2Module } from '../r2/r2.module';
import { ImageProcessingModule } from '../../image-processing/image-processing.module';
import { ImageStorageService } from './image-storage.service';
import { AvatarStorageService } from './avatar-storage.service';

@Module({
  imports: [R2Module, ImageProcessingModule],
  providers: [ImageStorageService, AvatarStorageService],
  exports: [ImageStorageService, AvatarStorageService],
})
export class ImageStorageModule {}
