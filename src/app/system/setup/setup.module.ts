import { Module } from '@nestjs/common';
import { SetupController } from './setup.controller';
import { SetupService } from './setup.service';
import { TokenModule } from '../tokens/tokens.module';
import { CookieModule } from '../cookie/cookie.module';
import { EmailModule } from '../communication/email/email.module';
import { ProfileModule } from 'src/app/product/profile/profile.module';

@Module({
  imports: [ProfileModule, TokenModule, EmailModule, CookieModule],
  controllers: [SetupController],
  providers: [SetupService],
})
export class SetupModule {}
