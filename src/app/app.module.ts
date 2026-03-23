import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/db.module';
import { StorageModule } from './storage/storage.module';
import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { RolesGuard } from './auth/guards/roles.guard';
import { OriginGuard } from './common/guards/origin.guard';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    StorageModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: OriginGuard, // 1st global guard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // 2nd global guard
    },
  ],
})
export class AppModule {}
