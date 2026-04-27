import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, IsNull, Repository } from 'typeorm';

import { DbConnectionName } from '../database.config';
import { UserTokenOrmEntity } from './user-token.orm-entity';
import { UserTokenType } from 'src/app/system/tokens/tokens.types';

@Injectable()
export class UserTokensRepository {
  constructor(
    @InjectRepository(UserTokenOrmEntity, DbConnectionName.READER)
    private readonly reader: Repository<UserTokenOrmEntity>,

    @InjectRepository(UserTokenOrmEntity, DbConnectionName.EDITOR)
    private readonly editor: Repository<UserTokenOrmEntity>,
  ) {}

  // ---------- Read ----------

  findActiveByWhere(where: FindOptionsWhere<UserTokenOrmEntity>) {
    return this.reader.find({
      where: {
        ...where,
        revokedAt: IsNull(),
      },
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: number) {
    return this.reader.findOneBy({ id });
  }

  findLatestActiveInitialSetupByDeviceAndOwnerEmail(
    email: string,
    deviceId: string,
  ) {
    return (
      this.reader
        .createQueryBuilder('t')
        .where('t.type = :type', { type: UserTokenType.INITIAL_SETUP })
        .andWhere('t.revokedAt IS NULL')
        .andWhere('t.deviceId = :deviceId', { deviceId })
        // JSONB: payload ->> 'ownerEmail'
        .andWhere(`t.payload ->> 'ownerEmail' = :email`, { email })
        .orderBy('t.createdAt', 'DESC')
        .getOne()
    );
  }

  // ---------- Write ----------

  create(payload: Partial<UserTokenOrmEntity>) {
    return this.editor.create(payload);
  }

  save(entity: UserTokenOrmEntity) {
    return this.editor.save(entity);
  }

  /**
   * Revoke (set revokedAt) for matching records
   */
  revokeWhere(
    where: FindOptionsWhere<UserTokenOrmEntity>,
    revokedAt = new Date(),
  ) {
    return this.editor.update(where, { revokedAt });
  }

  /**
   * Revoke by id
   */
  revokeById(id: number, revokedAt = new Date()) {
    return this.editor.update(id, { revokedAt });
  }
}
