import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbConnectionName } from '../database.config';
import { CartOrmEntity } from './cart.orm-entity';

@Injectable()
export class CartsRepository {
  constructor(
    @InjectRepository(CartOrmEntity, DbConnectionName.READER)
    private readonly reader: Repository<CartOrmEntity>,

    @InjectRepository(CartOrmEntity, DbConnectionName.EDITOR)
    private readonly editor: Repository<CartOrmEntity>,
  ) {}

  // ---------- Read ----------

  findById(id: number): Promise<CartOrmEntity | null> {
    return this.reader.findOneBy({ id });
  }

  findByUserId(userId: number): Promise<CartOrmEntity | null> {
    return this.reader.findOneBy({ userId });
  }

  findBySessionId(sessionId: string): Promise<CartOrmEntity | null> {
    return this.reader.findOneBy({ sessionId });
  }

  // ---------- Write ----------

  createForUser(userId: number): CartOrmEntity {
    return this.editor.create({ userId });
  }

  createForSession(sessionId: string): CartOrmEntity {
    return this.editor.create({ sessionId });
  }

  save(entity: CartOrmEntity): Promise<CartOrmEntity> {
    return this.editor.save(entity);
  }

  deleteById(id: number) {
    return this.editor.delete({ id });
  }

  deleteByUserId(userId: number) {
    return this.editor.delete({ userId });
  }
}
