import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from '../dto/error-response.dto';
import {
  ERROR_CODES,
  ErrorCode,
  HttpErrorResponse,
} from 'src/types/error.types';

export const HTTP_STATUS_TO_ERROR_CODE: Partial<Record<number, ErrorCode>> = {
  [HttpStatus.BAD_REQUEST]: ERROR_CODES.BAD_REQUEST,
  [HttpStatus.UNAUTHORIZED]: ERROR_CODES.UNAUTHORIZED,
  [HttpStatus.FORBIDDEN]: ERROR_CODES.FORBIDDEN,
  [HttpStatus.NOT_FOUND]: ERROR_CODES.NOT_FOUND,
  [HttpStatus.CONFLICT]: ERROR_CODES.CONFLICT,
  [HttpStatus.INTERNAL_SERVER_ERROR]: ERROR_CODES.INTERNAL_ERROR,
};

const DEFAULT_ERROR_MESSAGE = 'Something went wrong';
const DEFAULT_FALLBACK_MESSAGE = 'Unexpected error';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  private readonly errorCodeSet = new Set(Object.values(ERROR_CODES));

  private getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private isErrorCode(value: unknown): value is ErrorCode {
    return (
      typeof value === 'string' && this.errorCodeSet.has(value as ErrorCode)
    );
  }

  private getErrorPayload(
    exception: unknown,
    status: number,
  ): { message: string; code: ErrorCode } {
    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      if (typeof res === 'object' && res !== null) {
        const r = res as HttpErrorResponse;

        return {
          message: Array.isArray(r.message)
            ? r.message.length > 0
              ? r.message[0]
              : DEFAULT_FALLBACK_MESSAGE
            : (r.message ?? DEFAULT_FALLBACK_MESSAGE),
          code: this.isErrorCode(r.code)
            ? r.code
            : (HTTP_STATUS_TO_ERROR_CODE[status] ?? ERROR_CODES.INTERNAL_ERROR),
        };
      }

      return {
        message: typeof res === 'string' ? res : DEFAULT_FALLBACK_MESSAGE,
        code: HTTP_STATUS_TO_ERROR_CODE[status] ?? ERROR_CODES.INTERNAL_ERROR,
      };
    }

    return {
      message: DEFAULT_ERROR_MESSAGE,
      code: ERROR_CODES.INTERNAL_ERROR,
    };
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.getStatus(exception);
    const { message, code } = this.getErrorPayload(exception, status);

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${status} ${message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} - ${status} ${message}`,
      );
    }

    const errorResponse: ErrorResponseDto = {
      statusCode: status,
      code,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}
