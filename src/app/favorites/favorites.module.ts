import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { DbConnectionName } from '../db/db.config';
import { User } from '../users/entities/user.entity';
import { Image } from '../images/entities/image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite, User, Image], DbConnectionName.READER),
    TypeOrmModule.forFeature([Favorite, User, Image], DbConnectionName.EDITOR),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
