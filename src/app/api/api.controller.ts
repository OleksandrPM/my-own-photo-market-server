import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class ApiController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  root() {
    const prefix = this.config.get<string>('API_PREFIX') ?? 'api';

    return {
      status: 'ok',
      version: '1.0.0',
      message: 'Welcome to the API root endpoint',
      docs: `${prefix}/docs`,
      endpoints: {
        auth: `${prefix}/auth`,
        users: `${prefix}/users`,
        images: `${prefix}/images`,
        tags: `${prefix}/tags`,
        imageTags: `${prefix}/image-tags`,
      },
    };
  }
}
