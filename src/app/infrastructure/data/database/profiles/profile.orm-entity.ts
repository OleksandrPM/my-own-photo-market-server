import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from 'src/app/product/profile/profile.types';

@Entity('profiles')
@Index('profiles_email_unique_active_idx', ['email'], {
  unique: true,
  where: `"deleted_at" IS NULL`,
})
export class ProfileOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'citext',
  })
  email!: string;

  @Column({ type: 'text', nullable: true, default: null })
  username!: string | null;

  @Column({
    name: 'password_hash',
    type: 'text',
    select: false,
  })
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({
    name: 'is_verified',
    type: 'boolean',
    default: false,
  })
  isVerified!: boolean;

  @Column({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
    default: null,
  })
  deletedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
