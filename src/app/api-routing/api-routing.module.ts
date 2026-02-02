import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ApiModule } from '../api/api.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { TagsModule } from '../tags/tags.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { ImagesModule } from '../images/images.module';

@Module({
  imports: [
    ApiModule,
    AuthModule,
    UsersModule,
    ImagesModule,
    TagsModule,
    FavoritesModule,
    RouterModule.register([
      {
        path: 'api',
        module: ApiModule,
        children: [
          { path: 'auth', module: AuthModule },
          { path: 'users', module: UsersModule },
          { path: 'images', module: ImagesModule },
          { path: 'tags', module: TagsModule },
          { path: 'favorites', module: FavoritesModule },
        ],
      },
    ]),
  ],
})
export class ApiRoutingModule {}
