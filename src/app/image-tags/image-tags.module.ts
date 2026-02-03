import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageTagsService } from './image-tags.service';
import { ImageTagsController } from './image-tags.controller';
import { ImageTag } from './entities/image-tag.entity';
import { Tag } from '../tags/entities/tag.entity';
import { Image } from '../images/entities/image.entity';
import { DbConnectionName } from '../db/db.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageTag, Image, Tag], DbConnectionName.READER),
    TypeOrmModule.forFeature([ImageTag, Image, Tag], DbConnectionName.EDITOR),
  ],
  controllers: [ImageTagsController],
  providers: [ImageTagsService],
})
export class ImageTagsModule {}
