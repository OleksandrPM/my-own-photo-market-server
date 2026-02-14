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
        auth: '/api/auth',
        users: '/api/users',
        images: '/api/images',
        tags: '/api/tags',
        imageTags: '/api/image-tags',
      },
    };
  }
}
