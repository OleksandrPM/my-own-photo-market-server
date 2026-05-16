import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProfileResponseDto } from 'src/app/product/profiles/dto/profile-response.dto';
import type { Warning } from 'src/app/common/warning';

export class AuthResponseDto {
  @ApiProperty({ type: ProfileResponseDto })
  user!: ProfileResponseDto;

  @ApiProperty()
  accessToken!: string;

  @ApiPropertyOptional()
  warning?: Warning;
}
