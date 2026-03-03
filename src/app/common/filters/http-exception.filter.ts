import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ErrorResponseDto } from '../dto/error-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();

      const message =
        typeof res === 'string'
          ? res
          : (res as any).message || 'Unexpected error';

      const errorResponse: ErrorResponseDto = {
        statusCode: status,
        error: HttpStatus[status],
        message,
      };

      return response.status(status).json(errorResponse);
    }

    const errorResponse: ErrorResponseDto = {
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Unexpected server error',
    };

    return response.status(500).json(errorResponse);
  }
}
