import { ConflictException, Injectable } from '@nestjs/common';
import { ImageTag } from './entities/image-tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DbConnectionName } from '../db/db.config';
import { Repository } from 'typeorm';

@Injectable()
export class ImageTagsService {
  constructor(
    @InjectRepository(ImageTag, DbConnectionName.READER)
    private readonly readerRepository: Repository<ImageTag>,
    @InjectRepository(ImageTag, DbConnectionName.EDITOR)
    private readonly editorRepository: Repository<ImageTag>,
  ) {}

  async create(imageId: number, tagId: number): Promise<ImageTag> {
    // Prevent duplicates
    const existing = await this.findOne(imageId, tagId);
    if (existing) {
      throw new ConflictException('');
    }

    const imageTag = this.editorRepository.create({ imageId, tagId });
    return this.editorRepository.save(imageTag);
  }

  findAll(): Promise<ImageTag[]> {
    return this.readerRepository.find();
  }

  findOne(imageId: number, tagId: number): Promise<ImageTag | null> {
    return this.readerRepository.findOne({
      where: { imageId, tagId },
    });
  }

  findAllByImage(imageId: number): Promise<ImageTag[]> {
    return this.readerRepository.findBy({ imageId });
  }

  findAllByTag(tagId: number): Promise<ImageTag[]> {
    return this.readerRepository.findBy({ tagId });
  }
}
