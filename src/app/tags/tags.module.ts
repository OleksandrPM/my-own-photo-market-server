import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { DbConnectionName } from '../db/db.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag], DbConnectionName.READER),
    TypeOrmModule.forFeature([Tag], DbConnectionName.EDITOR),
  ],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService], //TODO: check if needed
})
export class TagsModule {}
