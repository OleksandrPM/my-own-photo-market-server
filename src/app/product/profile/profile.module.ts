import { Module } from '@nestjs/common';
import { ProfilesController } from './profile.controller';
import { ProfilesService } from './profile.service';
import { ImageStorageModule } from 'src/app/infrastructure/storage/image-storage/image-storage.module';
import { ProfilesDataModule } from 'src/app/infrastructure/data/database/profiles/profiles-data.module';
import { ProfilePresenter } from './profile.presenter';

@Module({
  imports: [ProfilesDataModule, ImageStorageModule],
  controllers: [ProfilesController],
  providers: [ProfilesService, ProfilePresenter],
  exports: [ProfilesService, ProfilePresenter],
})
export class ProfileModule {}
