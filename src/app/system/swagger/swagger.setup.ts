import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { swaggerConfig } from './swagger.config';
import { apiRoutes } from '../../common/path-builder/api.routes';

export function setupSwagger(app: INestApplication) {
  const configService = app.get(ConfigService);

  const apiPath = `${configService.get<string>('API_PREFIX') ?? 'api'}`;
  const versionPath = `${configService.get<string>('API_VERSION') ?? 'v1'}`;
  const docsPath = `${apiPath}/${versionPath}/${apiRoutes.DOCS.BASE}`;

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(docsPath, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  return docsPath; // optional: return it for use elsewhere
}
