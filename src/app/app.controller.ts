import { Controller, Get } from '@nestjs/common';
import { PathBuilderService } from './common/path-builder/path-builder.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly pathBuilder: PathBuilderService) {}

  @Get()
  @ApiOperation({ summary: 'App root endpoint' })
  @ApiOkResponse({
    description: 'Welcome message with API endpoint',
    example: {
      status: 'ok',
      message: 'Welcome to the my-own-photo-market backend',
      api: 'path/to/api',
    },
  })
  root() {
    return {
      status: 'ok',
      message: 'Welcome to the my-own-photo-market backend',
      api: this.pathBuilder.getApiRootPath(),
    };
  }
}
