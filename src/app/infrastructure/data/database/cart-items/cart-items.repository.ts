import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbConnectionName } from '../database.config';
import { CartItemOrmEntity } from './cart-item.orm-entity';

@Injectable()
export class CartItemsRepository {
  constructor(
    @InjectRepository(CartItemOrmEntity, DbConnectionName.READER)
    private readonly reader: Repository<CartItemOrmEntity>,

    @InjectRepository(CartItemOrmEntity, DbConnectionName.EDITOR)
    private readonly editor: Repository<CartItemOrmEntity>,
  ) {}

  // ---------- Read ----------

  findByCartId(cartId: number): Promise<CartItemOrmEntity[]> {
    return this.reader.find({
      where: { cartId },
      order: { addedAt: 'DESC' },
    });
  }

  findByImageId(imageId: number): Promise<CartItemOrmEntity[]> {
    return this.reader.find({
      where: { imageId },
      order: { addedAt: 'DESC' },
    });
  }

  findOne(cartId: number, imageId: number): Promise<CartItemOrmEntity | null> {
    return this.reader.findOneBy({ cartId, imageId });
  }

  exists(cartId: number, imageId: number): Promise<boolean> {
    return this.reader.exists({ where: { cartId, imageId } });
  }

  // ---------- Write ----------

  create(cartId: number, imageId: number): CartItemOrmEntity {
    return this.editor.create({ cartId, imageId });
  }

  save(entity: CartItemOrmEntity): Promise<CartItemOrmEntity> {
    return this.editor.save(entity);
  }

  delete(cartId: number, imageId: number) {
    return this.editor.delete({ cartId, imageId });
  }

  deleteAllByCartId(cartId: number) {
    return this.editor.delete({ cartId });
  }
}
