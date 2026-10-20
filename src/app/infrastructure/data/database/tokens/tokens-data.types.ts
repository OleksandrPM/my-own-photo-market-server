import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryDeepPartialEntity,
} from 'typeorm';
import { TokenOrmEntity } from './token.orm-entity';

export type TokenWhere = FindOptionsWhere<TokenOrmEntity>;
export type TokenPatch = QueryDeepPartialEntity<TokenOrmEntity>;

export type TokenFindOneOptions = Omit<
  FindOneOptions<TokenOrmEntity>,
  'where'
>;
export type TokenFindManyOptions = Omit<
  FindManyOptions<TokenOrmEntity>,
  'where'
>;
