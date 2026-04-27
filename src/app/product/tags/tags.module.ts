import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TagsDataModule } from 'src/app/infrastructure/data/database/tags/tags-data.module';

@Module({
  imports: [TagsDataModule],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
