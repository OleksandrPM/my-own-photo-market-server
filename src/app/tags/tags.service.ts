import { Repository } from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
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
  ) { }

  findAll(): Promise<Tag[]> {
    return this.readerRepository.find();
  }

  findById(id: number): Promise<Tag | null> {
    return this.readerRepository.findOneBy({ id });
  }

  findByName(name: string): Promise<Tag | null> {
    return this.readerRepository.findOneBy({ name });
  }

  async create(name: string): Promise<Tag> {
    const isTAgExists = await this.findByName(name);
    if (isTAgExists) {
      throw new ConflictException(`Tag with name ${name} already exists`);
    }
    const tag = this.editorRepository.create({ name });
    return this.editorRepository.save(tag);
  }

  async updateById(id: number, updatedTag: string): Promise<Tag | null> {
    const existingTag = await this.findById(id);

    if (!existingTag) {
      return null;
    }

    await this.editorRepository.update({ id }, { name: updatedTag });
    return this.findById(id);
  }

  async updateByName(tagName: string, newTagName: string): Promise<Tag | null> {
    const existingTag = await this.findByName(tagName);

    if (!existingTag) {
      return null;
    }

    await this.editorRepository.update({ name: tagName }, { name: newTagName });
    return this.findByName(newTagName);
  }

  async removeById(id: number): Promise<Tag | null> {
    const tag = await this.findById(id);
    if (!tag) {
      return null;
    } else {
      await this.editorRepository.delete({ id });
      return tag;
    }
  }

  async removeByName(name: string): Promise<Tag | null> {
    const existingTag = await this.findByName(name);

    if (!existingTag) {
      return null;
    } else {
      await this.editorRepository.delete({ name });
      return existingTag;
    }
  }
}
