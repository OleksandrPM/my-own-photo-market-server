import { Module } from '@nestjs/common';
import { CookiesService } from './cookies.service';
import { PathBuilderModule } from 'src/app/common/api/path-builder/path-builder.module';
import { CookiesConfigService } from './cookies-config.service';

@Module({
  imports: [PathBuilderModule],
  providers: [CookiesConfigService, CookiesService],
  exports: [CookiesService],
})
export class CookiesModule {}
