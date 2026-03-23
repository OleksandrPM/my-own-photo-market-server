import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  root() {
    const apiPrefix = this.config.get<string>('API_PREFIX');
    const versionPrefix = this.config.get<string>('API_VERSION');

    return {
      status: 'ok',
      message: 'Welcome to the my-own-photo-market backend',
      api: `/${apiPrefix}/${versionPrefix}`,
    };
  }
}
