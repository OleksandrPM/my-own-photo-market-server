import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserTokenType } from 'src/app/system/tokens/tokens.types';
import { UserTokenPayload } from 'src/app/system/tokens/tokens.payload';

@Entity('user_tokens')
@Index('user_tokens_user_id_idx', ['userId'])
@Index('user_tokens_type_idx', ['type'])
@Index('user_tokens_expires_at_idx', ['expiresAt'])
export class UserTokenOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: 'user_id',
    type: 'int',
    nullable: true,
  })
  userId!: number | null;

  @Column({
    name: 'token_hash',
    type: 'text',
  })
  tokenHash!: string;

  @Column({
    type: 'enum',
    enum: UserTokenType,
  })
  type!: UserTokenType;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  payload!: UserTokenPayload | null;

  @Column({
    name: 'expires_at',
    type: 'timestamptz',
  })
  expiresAt!: Date;

  @Column({
    name: 'device_id',
    type: 'text',
    nullable: true,
  })
  deviceId!: string | null;

  @Column({
    name: 'revoked_at',
    type: 'timestamptz',
    nullable: true,
  })
  revokedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
