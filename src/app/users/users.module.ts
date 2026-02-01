import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { PasswordModule } from '../password/password.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User], 'reader'),
    TypeOrmModule.forFeature([User], 'editor'),
    PasswordModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
