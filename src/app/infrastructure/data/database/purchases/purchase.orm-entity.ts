import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('purchases')
@Index('purchases_user_id_idx', ['userId'])
@Index('purchases_image_id_idx', ['imageId'])
@Index('purchases_purchased_at_idx', ['purchasedAt'])
@Index('purchases_payment_id_idx', ['paymentId'])
@Index('purchases_user_image_unique_idx', ['userId', 'imageId'], {
  unique: true,
})
export class PurchaseOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @Column({ name: 'image_id', type: 'int' })
  imageId!: number;

  /**
   * Postgres best practice: store money as NUMERIC, not float.
   * Using string in TS to avoid precision loss.
   */
  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price!: string;

  @Column({ type: 'char', length: 3, nullable: true, default: null })
  currency!: string | null;

  @Column({ name: 'payment_id', type: 'text', nullable: true, default: null })
  paymentId!: string | null;

  @CreateDateColumn({ name: 'purchased_at', type: 'timestamptz' })
  purchasedAt!: Date;
}
