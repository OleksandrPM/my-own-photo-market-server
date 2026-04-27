import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailModule } from '../communications/email/email.module';
import { TokenModule } from '../tokens/tokens.module';
import { CookiesModule } from '../cookies/cookies.module';
import { ProfilesModule } from 'src/app/product/profiles/profiles.module';
import { UsersDataModule } from 'src/app/infrastructure/data/database/users/users-data.module';
import { ImageStorageModule } from 'src/app/infrastructure/storage/image-storage/image-storage.module';

@Module({
  imports: [
    ProfilesModule,
    UsersDataModule,
    ImageStorageModule,
    EmailModule,
    TokenModule,
    CookiesModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
