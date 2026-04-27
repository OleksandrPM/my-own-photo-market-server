import { Module } from '@nestjs/common';
import { PathBuilderModule } from 'src/app/common/path-builder/path-builder.module';
import { EmailService } from './email.service';
import { EmailVerificationService } from './handlers/email-verification.service';
import { EmailSetupService } from './handlers/email-setup.service';
import { EmailManagerService } from './email-manager.service';

@Module({
  imports: [PathBuilderModule],
  providers: [
    EmailService,
    EmailVerificationService,
    EmailSetupService,
    EmailManagerService,
  ],
  exports: [EmailManagerService],
})
export class EmailModule {}
