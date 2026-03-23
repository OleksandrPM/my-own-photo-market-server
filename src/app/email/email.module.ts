import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailConfirmationService } from './email-confirmation.service';
import { TokenModule } from '../token/token.module';
import { PathBuilderModule } from '../path-builder/path-builder.module';

@Module({
  imports: [TokenModule, PathBuilderModule],
  providers: [EmailService, EmailConfirmationService],
  exports: [EmailService, EmailConfirmationService],
})
export class EmailModule {}
