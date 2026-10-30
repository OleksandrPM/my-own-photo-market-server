import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { SetupModule } from '../system/setup/setup.module';
import { AuthModule } from '../system/auth/auth.module';
// import { ImageModule } from '../product/image/images.module';
import { TagsModule } from '../product/tag/tag.module';
import { apiRoutes } from '../common/api/api.routes';
import { PathBuilderModule } from '../common/api/path-builder/path-builder.module';

@Module({
  imports: [
    PathBuilderModule,
    SetupModule,
    AuthModule,
    // ImageModule,
    TagsModule,
    RouterModule.register([
      {
        path: `${process.env.API_PREFIX ?? 'api'}/${process.env.API_VERSION ?? 'v1'}`,
        module: ApiModule,
        children: [
          { path: `${apiRoutes.SETUP.BASE}`, module: SetupModule },
          { path: `${apiRoutes.AUTH.BASE}`, module: AuthModule },
          // { path: `${apiRoutes.IMAGES.BASE}`, module: ImagesModule },
          { path: `${apiRoutes.TAGS.BASE}`, module: TagsModule },
        ],
      },
    ]),
  ],
  controllers: [ApiController],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
