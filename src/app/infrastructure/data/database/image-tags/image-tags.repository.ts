import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbConnectionName } from '../database.config';
import { ImageTagOrmEntity } from './image-tag.orm-entity';

@Injectable()
export class ImageTagsRepository {
  constructor(
    @InjectRepository(ImageTagOrmEntity, DbConnectionName.READER)
    private readonly reader: Repository<ImageTagOrmEntity>,

    @InjectRepository(ImageTagOrmEntity, DbConnectionName.EDITOR)
    private readonly editor: Repository<ImageTagOrmEntity>,
  ) {}

  // ---------- Read ----------

  findByImageId(imageId: number): Promise<ImageTagOrmEntity[]> {
    return this.reader.find({ where: { imageId } });
  }

  findByTagId(tagId: number): Promise<ImageTagOrmEntity[]> {
    return this.reader.find({ where: { tagId } });
  }

  findOne(imageId: number, tagId: number): Promise<ImageTagOrmEntity | null> {
    return this.reader.findOneBy({ imageId, tagId });
  }

  exists(imageId: number, tagId: number): Promise<boolean> {
    return this.reader.exists({ where: { imageId, tagId } });
  }

  // ---------- Write ----------

  create(imageId: number, tagId: number): ImageTagOrmEntity {
    return this.editor.create({ imageId, tagId });
  }

  save(entity: ImageTagOrmEntity): Promise<ImageTagOrmEntity> {
    return this.editor.save(entity);
  }

  delete(imageId: number, tagId: number) {
    return this.editor.delete({ imageId, tagId });
  }

  deleteAllByImageId(imageId: number) {
    return this.editor.delete({ imageId });
  }

  deleteAllByTagId(tagId: number) {
    return this.editor.delete({ tagId });
  }
}
