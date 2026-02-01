import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PasswordModule } from '../password/password.module';

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
    UsersModule,
    PasswordModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
