import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TagsDataModule } from 'src/app/infrastructure/data/database/tags/tags-data.module';

@Module({
  imports: [TagsDataModule],
  controllers: [TagController],
  providers: [TagService],
})
export class TagsModule {}
