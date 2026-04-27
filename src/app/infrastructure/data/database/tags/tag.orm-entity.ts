import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tags')
@Index('tags_name_unique_idx', ['name'], { unique: true })
export class TagOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'text',
  })
  name!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
