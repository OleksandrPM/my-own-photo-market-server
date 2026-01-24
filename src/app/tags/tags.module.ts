import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag], 'reader'),
    TypeOrmModule.forFeature([Tag], 'editor'),
  ],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService], //TODO: check if needed
})
export class TagsModule {}
