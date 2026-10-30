import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  ImageFormat,
  ImageOrientation,
  ImageType,
} from 'src/app/product/image/image.types';

@Entity('images')
@Check(`"width" > 0`)
@Check(`"height" > 0`)
@Index('images_type_idx', ['type'])
@Index('images_orientation_idx', ['orientation'])
@Index('images_captured_at_idx', ['capturedAt'])
@Index('images_created_at_idx', ['createdAt'])
export class ImageOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * SHA-256 hash of the original file.
   * Used for duplicate detection and integrity checks.
   */
  @Column({
    type: 'char',
    length: 64,
    unique: true,
  })
  hash!: string;

  @Column({
    name: 'original_filename',
    type: 'text',
    nullable: true,
  })
  originalFilename!: string | null;

  @Column({
    name: 'source_format',
    type: 'enum',
    enum: ImageFormat,
  })
  sourceFormat!: ImageFormat;

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

  // Size of the original file in bytes, stored as a string to accommodate large values.
  @Column({
    name: 'source_file_size',
    type: 'bigint',
  })
  sourceFileSize!: string;

  @Column({ type: 'int' })
  width!: number;

  @Column({ type: 'int' })
  height!: number;

  /**
   * Timestamp indicating when the image was captured, if available.
   * This field is nullable to accommodate images without capture date information.
   */
  @Column({
    name: 'captured_at',
    type: 'timestamptz',
    nullable: true,
  })
  capturedAt!: Date | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;
}
