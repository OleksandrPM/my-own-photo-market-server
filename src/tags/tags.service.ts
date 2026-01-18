import { Injectable } from '@nestjs/common';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private tagsRepository: Repository<Tag>) {}

  create(tagName: CreateTagDto): Promise<Tag> {
    const tag = this.tagsRepository.create({ tag: tagName.tag });
    return this.tagsRepository.save(tag);
  }

  async findAll(): Promise<Tag[]> {
    return this.tagsRepository.find();
  }

  findOne(id: number): Promise<Tag | null> {
    return this.tagsRepository.findOneBy({ id });
  }

  findByName(name: string): Promise<Tag | null> {
    return this.tagsRepository.findOneBy({ tag: name });
  }

  async update(id: number, updatedTag: UpdateTagDto): Promise<Tag | null> {
    return this.tagsRepository
      .update({ id }, updatedTag)
      .then(() => this.findOne(id));
  }

  async remove(id: number): Promise<void> {
    await this.tagsRepository.delete({ id });
  }
}
