import { ApiProperty } from '@nestjs/swagger';
import type { ErrorCode } from 'src/types/error.types';

export class ErrorResponseDto {
  @ApiProperty({ example: 401 })
  statusCode!: number;

  @ApiProperty({ example: 'USER_NOT_FOUND' })
  code!: ErrorCode;

  @ApiProperty({ example: 'User not found' })
  message!: string;

  @ApiProperty({ example: '/users/123' })
  path!: string;

  @ApiProperty({ example: '2026-06-22T08:00:00.000Z' })
  timestamp!: string;
}
