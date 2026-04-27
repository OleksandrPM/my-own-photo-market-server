import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbConnectionName } from '../database.config';
import { PurchaseOrmEntity } from './purchase.orm-entity';

@Injectable()
export class PurchasesRepository {
  constructor(
    @InjectRepository(PurchaseOrmEntity, DbConnectionName.READER)
    private readonly reader: Repository<PurchaseOrmEntity>,

    @InjectRepository(PurchaseOrmEntity, DbConnectionName.EDITOR)
    private readonly editor: Repository<PurchaseOrmEntity>,
  ) {}

  // ---------- Read ----------

  findById(id: number): Promise<PurchaseOrmEntity | null> {
    return this.reader.findOneBy({ id });
  }

  findByUserId(userId: number): Promise<PurchaseOrmEntity[]> {
    return this.reader.find({
      where: { userId },
      order: { purchasedAt: 'DESC' },
    });
  }

  findByImageId(imageId: number): Promise<PurchaseOrmEntity[]> {
    return this.reader.find({
      where: { imageId },
      order: { purchasedAt: 'DESC' },
    });
  }

  /**
   * Common check: has user purchased this image?
   * Uses composite unique index (userId,imageId) efficiently.
   */
  findByUserAndImage(
    userId: number,
    imageId: number,
  ): Promise<PurchaseOrmEntity | null> {
    return this.reader.findOneBy({ userId, imageId });
  }

  existsByUserAndImage(userId: number, imageId: number): Promise<boolean> {
    return this.reader.exists({ where: { userId, imageId } });
  }

  // ---------- Write ----------

  create(
    payload: Omit<PurchaseOrmEntity, 'id' | 'purchasedAt'> &
      Partial<Pick<PurchaseOrmEntity, 'purchasedAt'>>,
  ) {
    return this.editor.create(payload);
  }

  save(entity: PurchaseOrmEntity): Promise<PurchaseOrmEntity> {
    return this.editor.save(entity);
  }

  deleteById(id: number) {
    return this.editor.delete({ id });
  }
}
