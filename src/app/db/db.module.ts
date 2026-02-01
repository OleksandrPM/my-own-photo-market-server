import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { readerConfig, editorConfig, DbConnectionName } from './db.config';

// Add ConfigModule to imports if not already imported in the root module
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: DbConnectionName.READER,
      imports: [ConfigModule],
      useFactory: readerConfig,
      inject: [ConfigService],
    }),

    TypeOrmModule.forRootAsync({
      name: DbConnectionName.EDITOR,
      imports: [ConfigModule],
      useFactory: editorConfig,
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
