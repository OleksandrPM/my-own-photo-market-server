import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { ImageStorageModule } from 'src/app/infrastructure/storage/image-storage/image-storage.module';
import { UsersDataModule } from 'src/app/infrastructure/data/database/users/users-data.module';

@Module({
  imports: [UsersDataModule, ImageStorageModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
