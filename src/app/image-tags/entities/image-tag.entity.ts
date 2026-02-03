import { Image } from 'src/app/images/entities/image.entity';
import { Tag } from 'src/app/tags/entities/tag.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from 'typeorm';

@Unique(['imageId', 'tagId'])
@Entity('image_tags')
export class ImageTag {
  @PrimaryColumn({ name: 'image_id' })
  imageId: number;

  @PrimaryColumn({ name: 'tag_id' })
  tagId: number;

  @ManyToOne(() => Image, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'image_id' })
  image: Image;

  @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
