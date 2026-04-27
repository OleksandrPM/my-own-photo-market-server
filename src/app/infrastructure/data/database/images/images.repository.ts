import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbConnectionName } from '../database.config';
import { ImageOrmEntity } from './image.orm-entity';

@Injectable()
export class ImagesRepository {
  constructor(
    @InjectRepository(ImageOrmEntity, DbConnectionName.READER)
    private readonly reader: Repository<ImageOrmEntity>,

    @InjectRepository(ImageOrmEntity, DbConnectionName.EDITOR)
    private readonly editor: Repository<ImageOrmEntity>,
  ) {}

  // ---------- Read ----------

  findById(id: number): Promise<ImageOrmEntity | null> {
    return this.reader.findOneBy({ id });
  }

  findAll(): Promise<ImageOrmEntity[]> {
    return this.reader.find({ order: { createdAt: 'DESC' } });
  }

  findByType(type: ImageOrmEntity['type']): Promise<ImageOrmEntity[]> {
    return this.reader.find({
      where: { type },
      order: { createdAt: 'DESC' },
    });
  }

  findByOrientation(
    orientation: ImageOrmEntity['orientation'],
  ): Promise<ImageOrmEntity[]> {
    return this.reader.find({
      where: { orientation },
      order: { createdAt: 'DESC' },
    });
  }

  // ---------- Write ----------

  create(payload: Omit<ImageOrmEntity, 'id' | 'createdAt'>) {
    return this.editor.create(payload);
  }

  save(entity: ImageOrmEntity): Promise<ImageOrmEntity> {
    return this.editor.save(entity);
  }

  deleteById(id: number) {
    return this.editor.delete({ id });
  }
}
