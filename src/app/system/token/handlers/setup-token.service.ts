import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../token.service';
import { TypedToken, TokenType } from '../token.types';
import { TokensRepository } from 'src/app/infrastructure/data/database/tokens/tokens.repository';
import { asTypedToken } from '../token.guards';

@Injectable()
export class SetupTokenService {
  private readonly logger = new Logger(SetupTokenService.name);
  constructor(
    private readonly tokensRepository: TokensRepository,
    private readonly tokenService: TokenService,
  ) {}

  // Query methods
  private async findLatestSetupTokenBySessionId(
    sessionId: string,
  ): Promise<TypedToken<TokenType.INITIAL_SETUP> | null> {
    const tokenRecord = await this.tokensRepository.findOne(
      {
        type: TokenType.INITIAL_SETUP,
        sessionId,
      },
      {
        order: { createdAt: 'DESC' },
      },
    );

    return asTypedToken<TokenType.INITIAL_SETUP>(
      tokenRecord,
      TokenType.INITIAL_SETUP,
    );
  }

  async findSetupTokenById(tokenId: number) {
    const record = await this.tokensRepository.findById(tokenId);

    return asTypedToken(record, TokenType.INITIAL_SETUP);
  }

  // Public methods
  async createSetupToken(ownerEmail: string, sessionId: string) {
    return this.tokenService.createToken({
      type: TokenType.INITIAL_SETUP,
      userId: null,
      sessionId,
      ownerEmail,
    });
  }

  async getSetupTokenBySessionId(sessionId: string) {
    return this.findLatestSetupTokenBySessionId(sessionId);
  }

  async validateSetupToken(encodedToken: string, sessionId: string) {
    return this.tokenService.validateToken({
      type: TokenType.INITIAL_SETUP,
      encodedToken,
      sessionId,
    });
  }

  async validateSetupTokenFromEmail(encodedToken: string) {
    return this.tokenService.validateToken({
      type: TokenType.INITIAL_SETUP,
      encodedToken,
      skipSessionCheck: true,
    });
  }

  async confirmOwnerEmail(
    tokenId: number,
  ): Promise<TypedToken<TokenType.INITIAL_SETUP>> {
    const token = await this.tokensRepository.findById(tokenId);

    const typedToken = asTypedToken(token, TokenType.INITIAL_SETUP);

    if (!typedToken) {
      throw new UnauthorizedException('Invalid setup token');
    }

    if (!typedToken.payload.isConfirmed) {
      await this.tokensRepository.mergePayloadById(tokenId, {
        isConfirmed: true,
      });

      typedToken.payload.isConfirmed = true;
    }

    return typedToken;
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
