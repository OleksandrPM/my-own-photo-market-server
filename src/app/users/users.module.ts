import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { PasswordModule } from '../password/password.module';
import { DbConnectionName } from '../db/db.config';
import { StorageModule } from '../storage/storage.module';
import { R2Module } from '../r2/r2.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User], DbConnectionName.READER),
    TypeOrmModule.forFeature([User], DbConnectionName.EDITOR),
    PasswordModule,
    StorageModule,
    R2Module, // For testing storage access in users service
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
