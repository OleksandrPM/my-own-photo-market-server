import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DbConnectionName } from '../database.config';
import { TagOrmEntity } from './tag.orm-entity';

@Injectable()
export class TagsRepository {
  constructor(
    @InjectRepository(TagOrmEntity, DbConnectionName.READER)
    private readonly reader: Repository<TagOrmEntity>,

    @InjectRepository(TagOrmEntity, DbConnectionName.EDITOR)
    private readonly editor: Repository<TagOrmEntity>,
  ) {}

  // ---------- Read ----------

  findAll(): Promise<TagOrmEntity[]> {
    return this.reader.find();
  }

  findById(id: number): Promise<TagOrmEntity | null> {
    return this.reader.findOneBy({ id });
  }

  findByName(name: string): Promise<TagOrmEntity | null> {
    return this.reader.findOneBy({ name });
  }

  existsByName(name: string): Promise<boolean> {
    return this.reader.exists({ where: { name } });
  }

  // ---------- Write ----------

  create(payload: Pick<TagOrmEntity, 'name'>): TagOrmEntity {
    return this.editor.create(payload);
  }

  save(tag: TagOrmEntity): Promise<TagOrmEntity> {
    return this.editor.save(tag);
  }

  updateById(id: number, name: string) {
    return this.editor.update({ id }, { name });
  }

  updateByName(oldName: string, newName: string) {
    return this.editor.update({ name: oldName }, { name: newName });
  }

  deleteById(id: number) {
    return this.editor.delete({ id });
  }

  deleteByName(name: string) {
    return this.editor.delete({ name });
  }

  async createMany(names: string[]): Promise<TagOrmEntity[]> {
    const uniqueNames = [...new Set(names)];

    // WRITE (editor connection)
    await this.editor
      .createQueryBuilder()
      .insert()
      .into(TagOrmEntity)
      .values(uniqueNames.map((name) => ({ name })))
      .orIgnore()
      .execute();

    // READ (reader connection)
    return this.reader.find({
      where: { name: In(uniqueNames) },
    });
  }
}
