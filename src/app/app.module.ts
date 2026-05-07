import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/data/database/database.module';
import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { RolesGuard } from './system/auth/guards/roles.guard';
import { OriginGuard } from './common/guards/origin.guard';
import { PathBuilderModule } from './common/path-builder/path-builder.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ApiModule,
    PathBuilderModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: OriginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
