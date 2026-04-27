import { Module } from '@nestjs/common';
import { TokenService } from './tokens.service';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SetupTokenService } from './handlers/setup-token.service';
import { RefreshTokenService } from './handlers/refresh-token.service';
import { EmailConfirmTokenService } from './handlers/email-confirm-token.service';
import { PasswordResetTokenService } from './handlers/password-reset-token.service';
import { EmailChangeTokenService } from './handlers/email-change-token.service';
import { TwoFactorAuthTokenService } from './handlers/two-factor-token.service';
import { TokenManagerService } from './tokens-manager.service';
import { UserTokensDataModule } from 'src/app/infrastructure/data/database/user-tokens/user-tokens-data.module';

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
    UserTokensDataModule,
  ],
  providers: [
    TokenService,
    TokenManagerService,
    SetupTokenService,
    RefreshTokenService,
    EmailConfirmTokenService,
    PasswordResetTokenService,
    EmailChangeTokenService,
    TwoFactorAuthTokenService,
  ],
  exports: [TokenManagerService],
})
export class TokenModule {}
