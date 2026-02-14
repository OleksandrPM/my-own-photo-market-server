import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { swaggerConfig } from './swagger.config';

export function setupSwagger(app: INestApplication) {
  const configService = app.get(ConfigService);

  const prefix = configService.get<string>('API_PREFIX') ?? 'api';
  const docsPath = `${prefix}/docs`;

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(docsPath, app, document);

  return docsPath; // optional: return it for use elsewhere
}
