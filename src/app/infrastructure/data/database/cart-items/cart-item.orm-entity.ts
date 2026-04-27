import { CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('cart_items')
@Index('cart_items_cart_id_idx', ['cartId'])
@Index('cart_items_image_id_idx', ['imageId'])
export class CartItemOrmEntity {
  @PrimaryColumn({ name: 'cart_id', type: 'int' })
  cartId!: number;

  @PrimaryColumn({ name: 'image_id', type: 'int' })
  imageId!: number;

  @CreateDateColumn({ name: 'added_at', type: 'timestamptz' })
  addedAt!: Date;
}
