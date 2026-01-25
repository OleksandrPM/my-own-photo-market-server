import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      status: 'ok',
      message: 'Welcome to the my-own-photo-market backend',
      api: '/api',
    };
  }
}
