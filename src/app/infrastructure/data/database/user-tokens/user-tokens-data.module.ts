import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTokenOrmEntity } from './user-token.orm-entity';
import { DbConnectionName } from '../database.config';
import { UserTokensRepository } from './user-tokens.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTokenOrmEntity], DbConnectionName.READER),
    TypeOrmModule.forFeature([UserTokenOrmEntity], DbConnectionName.EDITOR),
  ],
  providers: [UserTokensRepository],
  exports: [UserTokensRepository],
})
export class UserTokensDataModule {}
