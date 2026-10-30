import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileOrmEntity } from './profile.orm-entity';
import { DbConnectionName } from '../database.config';
import { ProfilesRepository } from './profiles.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfileOrmEntity], DbConnectionName.READER),
    TypeOrmModule.forFeature([ProfileOrmEntity], DbConnectionName.EDITOR),
  ],
  providers: [ProfilesRepository],
  exports: [ProfilesRepository],
})
export class ProfilesDataModule {}
