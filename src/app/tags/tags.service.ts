import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag, 'reader')
    private readonly readerRepository: Repository<Tag>,
    @InjectRepository(Tag, 'editor')
    private readonly editorRepository: Repository<Tag>,
  ) {}

  create(tagName: CreateTagDto): Promise<Tag> {
    const tag = this.editorRepository.create({ tag: tagName.tag });
    return this.editorRepository.save(tag);
  }

  async findAll(): Promise<Tag[]> {
    return this.readerRepository.find();
  }

  findOne(id: number): Promise<Tag | null> {
    return this.readerRepository.findOneBy({ id });
  }

  findByName(name: string): Promise<Tag | null> {
    return this.readerRepository.findOneBy({ tag: name });
  }

  async update(id: number, updatedTag: UpdateTagDto): Promise<Tag | null> {
    return this.editorRepository
      .update({ id }, updatedTag)
      .then(() => this.findOne(id));
  }

  async remove(id: number): Promise<void> {
    await this.editorRepository.delete({ id });
  }
}
