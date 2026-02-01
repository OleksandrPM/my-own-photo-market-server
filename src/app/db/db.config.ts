import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export enum DbConnectionName {
  READER = 'reader',
  EDITOR = 'editor',
}

const commonConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get('DB_HOST'),
  port: parseInt(config.get('DB_PORT') ?? '5432', 10),
  database: config.get('DB_NAME'),
  autoLoadEntities: true,
  synchronize: false,
});

export const readerConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  name: DbConnectionName.READER,
  username: config.get('DB_READER'),
  password: config.get<string>('DB_READER_PASSWORD'),
  ...commonConfig(config),
});

export const editorConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  name: DbConnectionName.EDITOR,
  username: config.get('DB_EDITOR'),
  password: config.get<string>('DB_EDITOR_PASSWORD'),
  ...commonConfig(config),
});
