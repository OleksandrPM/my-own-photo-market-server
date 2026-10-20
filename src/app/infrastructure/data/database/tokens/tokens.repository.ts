import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Raw, Repository } from 'typeorm';
import { DbConnectionName } from '../database.config';
import { TokenOrmEntity } from './token.orm-entity';
import { UserTokenPayload } from 'src/app/system/tokens/tokens.payload';
import {
  TokenFindManyOptions,
  TokenFindOneOptions,
  TokenPatch,
  TokenWhere,
} from './tokens-data.types';

@Injectable()
export class TokensRepository {
  constructor(
    @InjectRepository(TokenOrmEntity, DbConnectionName.READER)
    private readonly reader: Repository<TokenOrmEntity>,

    @InjectRepository(TokenOrmEntity, DbConnectionName.EDITOR)
    private readonly editor: Repository<TokenOrmEntity>,
  ) {}

  // ---------- helpers ----------

  private activeWhere(where: TokenWhere): TokenWhere {
    return {
      ...where,
      revokedAt: IsNull(),
      expiresAt: Raw((alias) => `${alias} > NOW()`),
    };
  }

  // ---------- Write methods ----------

  create(payload: Partial<TokenOrmEntity>) {
    return this.editor.create(payload);
  }

  save(entity: TokenOrmEntity) {
    return this.editor.save(entity);
  }

  // ---------- Read methods ----------

  findById(id: number, options?: TokenFindOneOptions) {
    return this.reader.findOne({ where: { id }, ...options });
  }

  findOne(where: TokenWhere, options?: TokenFindOneOptions) {
    return this.reader.findOne({ where, ...options });
  }

  findMany(where: TokenWhere, options?: TokenFindManyOptions) {
    return this.reader.find({ where, ...options });
  }

  findActiveMany(where: TokenWhere, options?: TokenFindManyOptions) {
    return this.reader.find({
      where: this.activeWhere(where),
      ...options,
    });
  }

  findActiveOne(where: TokenWhere, options?: TokenFindOneOptions) {
    return this.reader.findOne({
      where: this.activeWhere(where),
      ...options,
    });
  }

  // ---------- Update methods ----------

  updateById(id: number, patch: TokenPatch) {
    return this.editor.update({ id }, patch);
  }

  updateWhere(where: TokenWhere, patch: TokenPatch) {
    return this.editor.update(where, patch);
  }

  updatePayloadById(id: number, payload: UserTokenPayload | null) {
    return this.editor.update({ id }, { payload });
  }

  updatePayloadWhere(where: TokenWhere, payload: UserTokenPayload | null) {
    return this.editor.update(where, { payload });
  }

  updateActivePayloadById(id: number, payload: UserTokenPayload | null) {
    return this.editor.update({ id, revokedAt: IsNull() }, { payload });
  }

  updateActivePayloadWhere(
    where: TokenWhere,
    payload: UserTokenPayload | null,
  ) {
    return this.editor.update({ ...where, revokedAt: IsNull() }, { payload });
  }

  async mergePayloadById(id: number, payloadPatch: Record<string, unknown>) {
    await this.editor
      .createQueryBuilder()
      .update(TokenOrmEntity)
      .set({
        payload: () => `COALESCE(payload, '{}'::jsonb) || :patch::jsonb`,
      })
      .where('id = :id', { id })
      .andWhere('revoked_at IS NULL')
      .setParameter('patch', JSON.stringify(payloadPatch))
      .execute();
  }

  // ---------- Revoke methods ----------

  revokeById(id: number, revokedAt = new Date()) {
    return this.editor.update({ id, revokedAt: IsNull() }, { revokedAt });
  }

  revokeWhere(where: TokenWhere, revokedAt = new Date()) {
    return this.editor.update({ ...where, revokedAt: IsNull() }, { revokedAt });
  }
}
