import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryDeepPartialEntity,
} from 'typeorm';
import { UserTokenOrmEntity } from './user-token.orm-entity';

export type TokenWhere = FindOptionsWhere<UserTokenOrmEntity>;
export type TokenPatch = QueryDeepPartialEntity<UserTokenOrmEntity>;

export type TokenFindOneOptions = Omit<
  FindOneOptions<UserTokenOrmEntity>,
  'where'
>;
export type TokenFindManyOptions = Omit<
  FindManyOptions<UserTokenOrmEntity>,
  'where'
>;
