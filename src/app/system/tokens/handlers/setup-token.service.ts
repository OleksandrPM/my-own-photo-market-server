import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../tokens.service';
import { UserTokenType } from '../tokens.types';
import { UserTokensRepository } from 'src/app/infrastructure/data/database/user-tokens/user-tokens.repository';

@Injectable()
export class SetupTokenService {
  constructor(
    private readonly tokensRepository: UserTokensRepository,
    private readonly tokenService: TokenService,
  ) {}

  async createSetupToken(ownerEmail: string, deviceId: string) {
    return this.tokenService.createToken({
      type: UserTokenType.INITIAL_SETUP,
      user: null,
      extra: { ownerEmail },
      deviceId,
    });
  }

  async validateSetupToken(token: string) {
    return this.tokenService.validateToken({
      type: UserTokenType.INITIAL_SETUP,
      token,
    });
  }

  async confirmOwnerEmail(tokenId: number) {
    const tokenRecord = await this.tokensRepository.findById(tokenId);

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid setup token');
    }

    const payload = tokenRecord.payload as {
      ownerEmail: string;
      isConfirmed: boolean;
    } | null;

    if (!payload) {
      throw new UnauthorizedException('Invalid token payload');
    }

    if (payload.isConfirmed) {
      return { tokenRecord }; // idempotent
    }

    tokenRecord.payload = {
      ...payload,
      isConfirmed: true,
    };

    await this.tokensRepository.save(tokenRecord);

    return { tokenRecord };
  }

  async isOwnerEmailConfirmed(email: string, deviceId: string) {
    const tokenRecord =
      await this.tokensRepository.findLatestActiveInitialSetupByDeviceAndOwnerEmail(
        email,
        deviceId,
      );

    return { isEmailConfirmed: !!tokenRecord?.payload };
  }
}
