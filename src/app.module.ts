import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import 'dotenv/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagsModule } from './tags/tags.module';

const typeOrmModule: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_SUPER_ADMIN || 'your_username',
  password: process.env.DB_SUPER_ADMIN_PASSWORD || 'your_password',
  database: process.env.DB_NAME || 'your_database',
  autoLoadEntities: true,
  synchronize: true, //TODO: change to false in production
};

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmModule), TagsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
