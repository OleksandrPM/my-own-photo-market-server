import { Module } from '@nestjs/common';
import { UserToken } from './entities/user-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConnectionName } from '../db/db.config';
import { TokenService } from './token.service';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<number>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserToken], DbConnectionName.READER),
    TypeOrmModule.forFeature([UserToken], DbConnectionName.EDITOR),
    UsersModule,
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
