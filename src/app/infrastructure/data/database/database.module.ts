import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  readerConfig,
  editorConfig,
  DbConnectionName,
} from './database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: DbConnectionName.READER,
      useFactory: readerConfig,
      inject: [ConfigService],
    }),

    TypeOrmModule.forRootAsync({
      name: DbConnectionName.EDITOR,
      useFactory: editorConfig,
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
