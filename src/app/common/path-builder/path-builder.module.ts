import { Module } from '@nestjs/common';
import { PathBuilderService } from './path-builder.service';

@Module({
  providers: [PathBuilderService],
  exports: [PathBuilderService],
})
export class PathBuilderModule {}
