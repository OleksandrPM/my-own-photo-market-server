import { Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('image_tags')
@Index('image_tags_image_id_idx', ['imageId'])
@Index('image_tags_tag_id_idx', ['tagId'])
export class ImageTagOrmEntity {
  @PrimaryColumn({ name: 'image_id', type: 'int' })
  imageId!: number;

  @PrimaryColumn({ name: 'tag_id', type: 'int' })
  tagId!: number;
}
