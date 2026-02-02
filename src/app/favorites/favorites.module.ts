import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { DbConnectionName } from '../db/db.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite], DbConnectionName.READER),
    TypeOrmModule.forFeature([Favorite], DbConnectionName.EDITOR),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
