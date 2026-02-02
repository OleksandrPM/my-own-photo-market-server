import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { DbConnectionName } from '../db/db.config';
import { Repository } from 'typeorm';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite, DbConnectionName.READER)
    private readonly readerRepository: Repository<Favorite>,
    @InjectRepository(Favorite, DbConnectionName.EDITOR)
    private readonly editorRepository: Repository<Favorite>,
  ) {}

  async create(userId: number, imageId: number): Promise<Favorite> {
    // Prevent duplicates
    const existing = await this.findOne(userId, imageId);
    if (existing) {
      throw new ConflictException('');
    }

    const favorite = this.editorRepository.create({ userId, imageId });
    return this.editorRepository.save(favorite);
  }

  findAll(): Promise<Favorite[]> {
    return this.readerRepository.find();
  }

  findOne(userId: number, imageId: number): Promise<Favorite | null> {
    return this.readerRepository.findOne({
      where: { userId, imageId },
    });
  }

  findAllByUser(userId: number): Promise<Favorite[]> {
    return this.readerRepository.findBy({ userId });
  }

  findAllByImage(imageId: number): Promise<Favorite[]> {
    return this.readerRepository.findBy({ imageId });
  }

  countByImage(imageId: number): Promise<number> {
    return this.readerRepository.count({ where: { imageId } });
  }

  async remove(userId: number, imageId: number): Promise<Favorite | null> {
    const favorite = await this.findOne(userId, imageId);

    if (!favorite) {
      return null;
    } else {
      await this.editorRepository.delete({ userId, imageId });
      return favorite;
    }
  }
}
