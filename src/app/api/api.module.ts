import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { TagsModule } from '../tags/tags.module';
import { TagsController } from '../tags/tags.controller';

@Module({
  imports: [TagsModule],
  controllers: [ApiController, TagsController],
})
export class ApiModule {}
