import { Module } from '@nestjs/common';
import { SetupController } from './setup.controller';
import { SetupService } from './setup.service';
import { TokenModule } from '../tokens/tokens.module';
import { CookiesModule } from '../cookies/cookies.module';
import { EmailModule } from '../communications/email/email.module';
import { ProfilesModule } from 'src/app/product/profiles/profiles.module';

@Module({
  imports: [ProfilesModule, TokenModule, EmailModule, CookiesModule],
  controllers: [SetupController],
  providers: [SetupService],
})
export class SetupModule {}
