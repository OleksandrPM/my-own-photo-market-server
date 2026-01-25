import { Controller, Get } from '@nestjs/common';

@Controller()
export class ApiController {
  @Get()
  root() {
    return {
      status: 'ok',
      version: '1.0.0',
      message: 'Welcome to the API root endpoint',
      endpoints: {
        tags: '/api/tags',
        images: '/api/images',
        auth: '/api/auth',
        users: '/api/users',
      },
    };
  }
}
