import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
} from '@nestjs/common';
import { ErrorResponseDto } from '../dto/error-response.dto';

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const errorResponse: ErrorResponseDto = {
      statusCode: 404,
      error: 'Not Found',
      message: 'Route does not exist',
    };

    response.status(404).json(errorResponse);
  }
}
