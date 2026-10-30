import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TokenType } from 'src/app/system/token/token.types';
import type { PersistentTokenType } from 'src/app/system/token/token.types';
import { TokenPayload } from 'src/app/system/token/token.payload';

@Entity('tokens')
@Index('user_tokens_user_id_idx', ['userId'])
@Index('user_tokens_type_idx', ['type'])
@Index('user_tokens_expires_at_idx', ['expiresAt'])
@Index('user_tokens_session_id_idx', ['sessionId'])
@Index('user_tokens_token_hash_uq', ['tokenHash'], { unique: true })
@Index(
  'user_tokens_active_user_type_created_idx',
  ['userId', 'type', 'createdAt'],
  {
    where: `"revoked_at" IS NULL`,
  },
)
@Index(
  'user_tokens_active_session_type_created_idx',
  ['sessionId', 'type', 'createdAt'],
  {
    where: `"revoked_at" IS NULL`,
  },
)
@Index('user_tokens_revoked_at_idx', ['revokedAt'])
export class TokenOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: TokenType,
  })
  type!: PersistentTokenType;

  @Column({
    name: 'token_hash',
    type: 'text',
  })
  tokenHash!: string;

  @Column({
    name: 'user_id',
    type: 'int',
    nullable: true,
  })
  userId!: number | null;

  @Column({
    name: 'device_id',
    type: 'text',
    nullable: true,
  })
  deviceId!: string | null;

  @Column({
    name: 'session_id',
    type: 'uuid',
    nullable: true,
  })
  sessionId!: string | null;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  payload!: TokenPayload | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({
    name: 'expires_at',
    type: 'timestamptz',
  })
  expiresAt!: Date;

  @Column({
    name: 'revoked_at',
    type: 'timestamptz',
    nullable: true,
  })
  revokedAt!: Date | null;
}
