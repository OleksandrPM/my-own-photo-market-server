import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { PasswordModule } from '../password/password.module';
import { DbConnectionName } from '../db/db.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User], DbConnectionName.READER),
    TypeOrmModule.forFeature([User], DbConnectionName.EDITOR),
    PasswordModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
