import { CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('favorites')
@Index('favorites_user_id_idx', ['userId'])
@Index('favorites_image_id_idx', ['imageId'])
export class FavoriteOrmEntity {
  @PrimaryColumn({ name: 'user_id', type: 'int' })
  userId!: number;

  @PrimaryColumn({ name: 'image_id', type: 'int' })
  imageId!: number;

  @CreateDateColumn({ name: 'added_at', type: 'timestamptz' })
  addedAt!: Date;
}
