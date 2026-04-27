import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ImageType {
  PHOTO = 'photo',
  ILLUSTRATION = 'illustration',
  VECTOR = 'vector',
}

export enum ImageOrientation {
  LANDSCAPE = 'landscape',
  PORTRAIT = 'portrait',
  SQUARE = 'square',
}

@Entity('images')
@Index('images_type_idx', ['type'])
@Index('images_orientation_idx', ['orientation'])
@Index('images_created_at_idx', ['createdAt'])
export class ImageOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Public or internal storage path (URL / key)
   */
  @Column({ type: 'text' })
  path!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', nullable: true, default: null })
  description!: string | null;

  @Column({
    type: 'enum',
    enum: ImageType,
  })
  type!: ImageType;

  @Column({
    type: 'enum',
    enum: ImageOrientation,
  })
  orientation!: ImageOrientation;

  /**
   * File size in bytes
   */
  @Column({ type: 'int', nullable: true })
  size!: number | null;

  @Column({ type: 'int' })
  width!: number;

  @Column({ type: 'int' })
  height!: number;

  /**
   * Base price for purchase
   * NUMERIC is correct for money in Postgres
   */
  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  price!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
