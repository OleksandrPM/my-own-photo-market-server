import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { DbConnectionName } from '../db/db.config';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag, DbConnectionName.READER)
    private readonly readerRepository: Repository<Tag>,
    @InjectRepository(Tag, DbConnectionName.EDITOR)
    private readonly editorRepository: Repository<Tag>,
  ) {}

  create(newTag: string): Promise<Tag> {
    const tag = this.editorRepository.create({ tag: newTag });
    return this.editorRepository.save(tag);
  }

  findAll(): Promise<Tag[]> {
    return this.readerRepository.find();
  }

  findById(id: number): Promise<Tag | null> {
    return this.readerRepository.findOneBy({ id });
  }

  findByName(name: string): Promise<Tag | null> {
    return this.readerRepository.findOneBy({ tag: name });
  }

  async update(id: number, updatedTag: string): Promise<Tag | null> {
    return this.editorRepository
      .update({ id }, { tag: updatedTag })
      .then(() => this.findById(id));
  }

  async remove(id: number): Promise<Tag | null> {
    const tag = await this.findById(id);
    if (!tag) {
      return null;
    } else {
      await this.editorRepository.delete({ id });
      return tag;
    }
  }
}
