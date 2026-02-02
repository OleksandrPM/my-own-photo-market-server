import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { Image } from 'src/app/images/entities/image.entity';
import { User } from 'src/app/users/entities/user.entity';

@Unique(['userId', 'imageId'])
@Entity('favorites')
export class Favorite {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'image_id' })
  imageId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Image)
  @JoinColumn({ name: 'image_id' })
  image: Image;

  @Column({
    name: 'added_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  addedAt: Date;
}
