import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { readerConfig, editorConfig } from './db.config';

// Add ConfigModule to imports if not already imported in the root module
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'reader',
      imports: [ConfigModule],
      useFactory: readerConfig,
      inject: [ConfigService],
    }),

    TypeOrmModule.forRootAsync({
      name: 'editor',
      imports: [ConfigModule],
      useFactory: editorConfig,
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
