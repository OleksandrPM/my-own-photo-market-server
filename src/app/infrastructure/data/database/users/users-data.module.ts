import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { DbConnectionName } from '../database.config';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity], DbConnectionName.READER),
    TypeOrmModule.forFeature([UserOrmEntity], DbConnectionName.EDITOR),
  ],
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class UsersDataModule {}
