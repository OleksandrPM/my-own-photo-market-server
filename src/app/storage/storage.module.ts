import { Module } from '@nestjs/common';
import { R2Module } from '../r2/r2.module';
import { ImageStorageService } from './image-storage.service';
import { ImageProcessingModule } from '../image-processing/image-processing.module';

@Module({
  imports: [R2Module, ImageProcessingModule],
  providers: [ImageStorageService],
  exports: [ImageStorageService],
})
export class StorageModule {}
