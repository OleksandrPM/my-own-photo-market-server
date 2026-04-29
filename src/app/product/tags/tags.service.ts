import { ConflictException, Injectable } from '@nestjs/common';
import { Tag } from './entities/tag.entity';
import { TagsRepository } from 'src/app/infrastructure/data/database/tags/tags.repository';

@Injectable()
export class TagsService {
  constructor(private readonly tagsRepository: TagsRepository) {}

  async findAll(): Promise<Tag[]> {
    const tagsOrm = await this.tagsRepository.findAll();

    return tagsOrm.map(Tag.fromOrm);
  }

  async findById(id: number): Promise<Tag | null> {
    const tagOrm = await this.tagsRepository.findById(id);

    return tagOrm ? Tag.fromOrm(tagOrm) : null;
  }

  async findByName(name: string): Promise<Tag | null> {
    const tagOrm = await this.tagsRepository.findByName(name);

    return tagOrm ? Tag.fromOrm(tagOrm) : null;
  }

  async create(name: string): Promise<Tag> {
    const isTAgExists = await this.findByName(name);

    if (isTAgExists) {
      throw new ConflictException(`Tag with name ${name} already exists`);
    }

    const tagEntity = this.tagsRepository.create({ name });
    const tagOrm = await this.tagsRepository.save(tagEntity);

    return Tag.fromOrm(tagOrm);
  }

  async createMany(newTags: string[]): Promise<Tag[]> {
    const tagsOrm = await this.tagsRepository.createMany(newTags);

    return tagsOrm.map(Tag.fromOrm);
  }

  async updateById(id: number, updatedTag: string): Promise<Tag | null> {
    const existingTag = await this.findById(id);

    if (!existingTag) {
      return null;
    }

    await this.tagsRepository.updateById(id, updatedTag);
    return this.findById(id);
  }

  async updateByName(tagName: string, newTagName: string): Promise<Tag | null> {
    const existingTag = await this.findByName(tagName);

    if (!existingTag) {
      return null;
    }

    await this.tagsRepository.updateByName(tagName, newTagName);
    return this.findByName(newTagName);
  }

  async removeById(id: number): Promise<Tag | null> {
    const tag = await this.findById(id);
    if (!tag) {
      return null;
    } else {
      await this.tagsRepository.deleteById(id);
      return tag;
    }
  }

  async removeByName(name: string): Promise<Tag | null> {
    const existingTag = await this.findByName(name);

    if (!existingTag) {
      return null;
    } else {
      await this.tagsRepository.deleteByName(name);
      return existingTag;
    }
  }
}
