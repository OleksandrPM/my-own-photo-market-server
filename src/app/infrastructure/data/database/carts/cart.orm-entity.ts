import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('carts')
@Index('carts_user_id_idx', ['userId'])
@Index('carts_session_id_idx', ['sessionId'])
export class CartOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Registered user cart (nullable for guest carts)
   */
  @Column({ name: 'user_id', type: 'int', nullable: true })
  userId!: number | null;

  /**
   * Guest cart identifier (cookie / session-based)
   */
  @Column({ name: 'session_id', type: 'text', nullable: true })
  sessionId!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
