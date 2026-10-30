import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessJwtStrategy } from './strategies/access-jwt.strategy';
import { EmailModule } from '../communication/email/email.module';
import { TokenModule } from '../token/token.module';
import { CookieModule } from '../cookie/cookie.module';
import { ProfileModule } from 'src/app/product/profile/profile.module';
import { ProfilesDataModule } from 'src/app/infrastructure/data/database/profiles/profiles-data.module';
import { ImageStorageModule } from 'src/app/infrastructure/storage/image-storage/image-storage.module';

@Module({
  imports: [
    ProfileModule,
    ProfilesDataModule,
    ImageStorageModule,
    EmailModule,
    TokenModule,
    CookieModule,
  ],
  providers: [AuthService, AccessJwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
