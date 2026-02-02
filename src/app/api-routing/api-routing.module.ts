import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ApiModule } from '../api/api.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { TagsModule } from '../tags/tags.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [
    ApiModule,
    AuthModule,
    UsersModule,
    TagsModule,
    FavoritesModule,
    RouterModule.register([
      {
        path: 'api',
        module: ApiModule,
        children: [
          { path: 'auth', module: AuthModule },
          { path: 'users', module: UsersModule },
          { path: 'tags', module: TagsModule },
          { path: 'favorites', module: FavoritesModule },
        ],
      },
    ]),
  ],
})
export class ApiRoutingModule {}
