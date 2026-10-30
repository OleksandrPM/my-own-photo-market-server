import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { SetupTokenService } from './handlers/setup-token.service';
import { RefreshTokenService } from './handlers/refresh-token.service';
import { EmailConfirmTokenService } from './handlers/email-confirm-token.service';
import { PasswordResetTokenService } from './handlers/password-reset-token.service';
import { EmailChangeTokenService } from './handlers/email-change-token.service';
import { TwoFactorAuthTokenService } from './handlers/two-factor-token.service';
import { TokenManagerService } from './token-manager.service';
import { TokensDataModule } from 'src/app/infrastructure/data/database/tokens/tokens-data.module';
import { AccessTokenService } from './handlers/access-token.service';
import { CsrfTokenService } from './handlers/csrf-token.service';
import { JwtTokenService } from './jwt/jwt-token.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    TokensDataModule,
  ],
  providers: [
    JwtTokenService,
    TokenService,
    TokenManagerService,
    CsrfTokenService,
    AccessTokenService,
    SetupTokenService,
    RefreshTokenService,
    EmailConfirmTokenService,
    PasswordResetTokenService,
    EmailChangeTokenService,
    TwoFactorAuthTokenService,
  ],
  exports: [JwtTokenService, TokenManagerService],
})
export class TokenModule {}
