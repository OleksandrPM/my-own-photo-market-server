import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { swaggerConfig } from './swagger.config';
import { ApiRoutes } from '../path-builder/api.routes';

export function setupSwagger(app: INestApplication) {
  const configService = app.get(ConfigService);

  const apiPath = `${configService.get<string>('API_PREFIX') ?? 'api'}`;
  const versionPath = `${configService.get<string>('API_VERSION') ?? 'v1'}`;
  const docsPath = `${apiPath}/${versionPath}/${ApiRoutes.DOCS.BASE}`;

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(docsPath, app, document);

  return docsPath; // optional: return it for use elsewhere
}
