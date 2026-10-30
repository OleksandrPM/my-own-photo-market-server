import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileOrmEntity } from './profile.orm-entity';
import { DbConnectionName } from '../database.config';
import { UserRole } from 'src/app/product/profile/profile.types';

@Injectable()
export class ProfilesRepository {
  constructor(
    @InjectRepository(ProfileOrmEntity, DbConnectionName.READER)
    private readonly reader: Repository<ProfileOrmEntity>,

    @InjectRepository(ProfileOrmEntity, DbConnectionName.EDITOR)
    private readonly editor: Repository<ProfileOrmEntity>,
  ) {}

  // ---------- Read ----------

  findAll() {
    return this.reader.find();
  }

  findById(id: number) {
    return this.reader.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.reader.findOneBy({ email });
  }

  findByEmailWithPasswordHash(email: string) {
    return this.reader
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email })
      .andWhere('u.deletedAt IS NULL')
      .getOne();
  }

  existsByEmail(email: string): Promise<boolean> {
    return this.reader.exists({ where: { email } });
  }

  existsAdmin(): Promise<boolean> {
    return this.reader.exists({
      where: { role: UserRole.ADMIN },
    });
  }

  // ---------- Write ----------

  create(payload: Partial<ProfileOrmEntity>) {
    return this.editor.create(payload);
  }

  save(user: ProfileOrmEntity) {
    return this.editor.save(user);
  }

  update(id: number, payload: Partial<ProfileOrmEntity>) {
    return this.editor.update(id, payload);
  }

  delete(id: number) {
    return this.editor.delete(id);
  }
}
