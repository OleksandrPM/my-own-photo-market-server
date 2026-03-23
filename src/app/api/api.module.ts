import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ImagesModule } from '../images/images.module';
import { TagsModule } from '../tags/tags.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { ImageTagsModule } from '../image-tags/image-tags.module';
import { RouterModule } from '@nestjs/core';
import { ApiRoutes } from '../path-builder/api.routes';
import { ApiService } from './api.service';
import { PathBuilderModule } from '../path-builder/path-builder.module';

@Module({
  imports: [
    PathBuilderModule,
    AuthModule,
    UsersModule,
    ImagesModule,
    TagsModule,
    FavoritesModule,
    ImageTagsModule,
    RouterModule.register([
      {
        path: `${process.env.API_PREFIX ?? 'api'}/${process.env.API_VERSION ?? 'v1'}`,
        module: ApiModule,
        children: [
          { path: `${ApiRoutes.AUTH.BASE}`, module: AuthModule },
          { path: `${ApiRoutes.USERS.BASE}`, module: UsersModule },
          { path: `${ApiRoutes.IMAGES.BASE}`, module: ImagesModule },
          { path: `${ApiRoutes.TAGS.BASE}`, module: TagsModule },
          { path: `${ApiRoutes.IMAGE_TAGS.BASE}`, module: ImageTagsModule },
          { path: `${ApiRoutes.FAVORITES.BASE}`, module: FavoritesModule },
        ],
      },
    ]),
  ],
  controllers: [ApiController],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
