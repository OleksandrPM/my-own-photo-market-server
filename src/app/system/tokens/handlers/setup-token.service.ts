import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../tokens.service';
import { asTypedToken, TypedUserToken, UserTokenType } from '../tokens.types';
import { UserTokensRepository } from 'src/app/infrastructure/data/database/user-tokens/user-tokens.repository';

@Injectable()
export class SetupTokenService {
  private readonly logger = new Logger(SetupTokenService.name);
  constructor(
    private readonly tokensRepository: UserTokensRepository,
    private readonly tokenService: TokenService,
  ) {}

  // Query methods
  private async findLatestSetupTokenBySessionId(
    sessionId: string,
  ): Promise<TypedUserToken<UserTokenType.INITIAL_SETUP> | null> {
    const tokenRecord = await this.tokensRepository.findOne(
      {
        type: UserTokenType.INITIAL_SETUP,
        sessionId,
      },
      {
        order: { createdAt: 'DESC' },
      },
    );

    return asTypedToken<UserTokenType.INITIAL_SETUP>(
      tokenRecord,
      UserTokenType.INITIAL_SETUP,
    );
  }

  async findSetupTokenById(tokenId: number) {
    const record = await this.tokensRepository.findById(tokenId);

    return asTypedToken(record, UserTokenType.INITIAL_SETUP);
  }

  // Public methods
  async createSetupToken(ownerEmail: string, sessionId: string) {
    return this.tokenService.createToken({
      type: UserTokenType.INITIAL_SETUP,
      user: null,
      sessionId,
      ownerEmail,
    });
  }

  async getSetupTokenBySessionId(sessionId: string) {
    return this.findLatestSetupTokenBySessionId(sessionId);
  }

  async validateSetupToken(tokenId: number, token: string, sessionId: string) {
    return this.tokenService.validateToken({
      type: UserTokenType.INITIAL_SETUP,
      tokenId,
      token,
      sessionId,
    });
  }

  async validateSetupTokenFromEmail(tokenId: number, token: string) {
    return this.tokenService.validateToken({
      type: UserTokenType.INITIAL_SETUP,
      tokenId,
      token,
      skipSessionCheck: true,
    });
  }

  async confirmOwnerEmail(
    tokenId: number,
  ): Promise<TypedUserToken<UserTokenType.INITIAL_SETUP>> {
    const token = await this.tokensRepository.findById(tokenId);

    const typed = asTypedToken(token, UserTokenType.INITIAL_SETUP);

    if (!typed) {
      throw new UnauthorizedException('Invalid setup token');
    }

    if (!typed.payload.isConfirmed) {
      await this.tokensRepository.mergePayloadById(tokenId, {
        isConfirmed: true,
      });

      typed.payload.isConfirmed = true;
    }

    return typed;
  }

  async isOwnerEmailConfirmed(sessionId: string) {
    const tokenRecord = await this.findLatestSetupTokenBySessionId(sessionId);

    if (!tokenRecord?.payload) {
      this.logger.warn(`Setup session not found: ${sessionId}`);

      throw new NotFoundException(`Setup session not found: ${sessionId}`);
    }

    const isRevoked = tokenRecord.revokedAt !== null;
    const isExpired = tokenRecord.expiresAt <= new Date();

    const isTokenActive = !isRevoked && !isExpired;

    return {
      isEmailConfirmed: isTokenActive && tokenRecord.payload.isConfirmed,
    };
  }
}
