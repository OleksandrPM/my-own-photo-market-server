import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenOrmEntity } from './token.orm-entity';
import { DbConnectionName } from '../database.config';
import { TokensRepository } from './tokens.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenOrmEntity], DbConnectionName.READER),
    TypeOrmModule.forFeature([TokenOrmEntity], DbConnectionName.EDITOR),
  ],
  providers: [TokensRepository],
  exports: [TokensRepository],
})
export class TokensDataModule {}
