import { Module } from '@nestjs/common';
import { TagsRepository } from './tags.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagOrmEntity } from './tag.orm-entity';
import { DbConnectionName } from '../database.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([TagOrmEntity], DbConnectionName.READER),
    TypeOrmModule.forFeature([TagOrmEntity], DbConnectionName.EDITOR),
  ],
  providers: [TagsRepository],
  exports: [TagsRepository],
})
export class TagsDataModule {}
