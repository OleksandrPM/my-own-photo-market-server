import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbConnectionName } from '../database.config';
import { FavoriteOrmEntity } from './favorite.orm-entity';

@Injectable()
export class FavoritesRepository {
  constructor(
    @InjectRepository(FavoriteOrmEntity, DbConnectionName.READER)
    private readonly reader: Repository<FavoriteOrmEntity>,

    @InjectRepository(FavoriteOrmEntity, DbConnectionName.EDITOR)
    private readonly editor: Repository<FavoriteOrmEntity>,
  ) {}

  // ---------- Read ----------

  findByUserId(userId: number): Promise<FavoriteOrmEntity[]> {
    return this.reader.find({
      where: { userId },
      order: { addedAt: 'DESC' },
    });
  }

  findByImageId(imageId: number): Promise<FavoriteOrmEntity[]> {
    return this.reader.find({
      where: { imageId },
      order: { addedAt: 'DESC' },
    });
  }

  findOne(userId: number, imageId: number): Promise<FavoriteOrmEntity | null> {
    return this.reader.findOneBy({ userId, imageId });
  }

  exists(userId: number, imageId: number): Promise<boolean> {
    return this.reader.exists({ where: { userId, imageId } });
  }

  // ---------- Write ----------

  create(userId: number, imageId: number): FavoriteOrmEntity {
    return this.editor.create({ userId, imageId });
  }

  save(entity: FavoriteOrmEntity): Promise<FavoriteOrmEntity> {
    return this.editor.save(entity);
  }

  delete(userId: number, imageId: number) {
    return this.editor.delete({ userId, imageId });
  }

  deleteAllByUserId(userId: number) {
    return this.editor.delete({ userId });
  }
}
