import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserTokenType } from '../tokens.types';
import { TokenPayloads, UserTokenPayload } from '../tokens.payload';

@Entity('user_tokens')
export class UserToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({ name: 'user_id', type: 'int', nullable: true })
  userId!: number | null;

  @Column({ name: 'token_hash', type: 'text' })
  tokenHash!: string;

  @Index()
  @Column({ name: 'type', type: 'enum', enum: UserTokenType })
  type!: UserTokenType;

  @Column({ type: 'jsonb', nullable: true })
  payload!: UserTokenPayload | null;

  @Index()
  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ name: 'device_id', type: 'text', nullable: true })
  deviceId!: string | null;

  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  getTypedPayload<T extends UserTokenType>(
    this: UserToken & { type: T },
  ): TokenPayloads[T] | null {
    return this.payload as TokenPayloads[T] | null;
  }
}
