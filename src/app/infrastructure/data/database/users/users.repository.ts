import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { DbConnectionName } from '../database.config';
import { UserRole } from 'src/app/product/profiles/user.types';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserOrmEntity, DbConnectionName.READER)
    private readonly reader: Repository<UserOrmEntity>,

    @InjectRepository(UserOrmEntity, DbConnectionName.EDITOR)
    private readonly editor: Repository<UserOrmEntity>,
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

  create(payload: Partial<UserOrmEntity>) {
    return this.editor.create(payload);
  }

  save(user: UserOrmEntity) {
    return this.editor.save(user);
  }

  update(id: number, payload: Partial<UserOrmEntity>) {
    return this.editor.update(id, payload);
  }

  delete(id: number) {
    return this.editor.delete(id);
  }
}
