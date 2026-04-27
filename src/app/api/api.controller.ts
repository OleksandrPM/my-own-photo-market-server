import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  @ApiOperation({ summary: 'Get API root information' })
  @ApiOkResponse({
    description: 'API root information',
    example: {
      status: 'ok',
      version: 'v1',
      message:
        'Welcome to the API root endpoint of the my-own-photo-market backend!',
      docs: 'path/to/api/docs',
      endpoints: {
        setup: 'path/to/api/setup',
        auth: 'path/to/api/auth',
        profiles: 'path/to/api/profiles',
        images: 'path/to/api/images',
        tags: 'path/to/api/tags',
      },
    },
  })
  getRoot() {
    const apiInfo = this.apiService.getRoot();

    return apiInfo;
  }
}
