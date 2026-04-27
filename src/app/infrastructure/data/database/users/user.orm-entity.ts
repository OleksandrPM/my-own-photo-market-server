import { UserRole } from 'src/app/product/profiles/user.types';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
@Index(
  // ✅ Partial UNIQUE index for active users only
  'users_email_unique_active_idx',
  ['email'],
  {
    unique: true,
    // example condition — adjust to your lifecycle rules
    where: `"deleted_at" IS NULL`,
  },
)
export class UserOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * ✅ Case‑insensitive email via Postgres CITEXT
   */
  @Column({
    type: 'citext',
  })
  email!: string;

  @Column({ type: 'text', nullable: true, default: null })
  username!: string | null;

  /**
   * ✅ Never selected by default (security first)
   */
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
    name: 'avatar_key',
    type: 'text',
    nullable: true,
    default: null,
  })
  avatarKey!: string | null;

  @Column({
    name: 'is_verified',
    type: 'boolean',
    default: false,
  })
  isVerified!: boolean;

  /**
   * ✅ Soft‑delete column (for partial index support)
   */
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
