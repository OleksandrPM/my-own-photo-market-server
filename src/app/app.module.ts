import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DatabaseModule } from './infrastructure/data/database/database.module';
import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { RolesGuard } from './system/auth/guards/roles.guard';
import { OriginGuard } from './common/guards/origin.guard';
import { PathBuilderModule } from './common/api/path-builder/path-builder.module';
import { InitCookiesMiddleware } from './common/middlewares/init-cookies.middleware';
import { TokenModule } from './system/tokens/tokens.module';
import { CookiesModule } from './system/cookies/cookies.module';
import { CsrfGuard } from './common/guards/csrf.guard';
import { join } from 'path/win32';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ApiModule,
    PathBuilderModule,
    TokenModule,
    CookiesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: OriginGuard,
    },
    { provide: APP_GUARD, useClass: CsrfGuard },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InitCookiesMiddleware).forRoutes('*');
  }
}
