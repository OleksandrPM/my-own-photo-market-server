import { Module } from '@nestjs/common';
import { CookieService } from './cookie.service';
import { PathBuilderModule } from 'src/app/common/api/path-builder/path-builder.module';
import { CookieConfigService } from './cookie-config.service';

@Module({
  imports: [PathBuilderModule],
  providers: [CookieConfigService, CookieService],
  exports: [CookieService],
})
export class CookieModule {}
