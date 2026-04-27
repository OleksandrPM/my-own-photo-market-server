import { Injectable } from '@nestjs/common';
import { apiRoutes } from '../common/path-builder/api.routes';
import { toCamelCase } from '../common/utils/string.utils';
import { PathBuilderService } from '../common/path-builder/path-builder.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiService {
  constructor(
    private readonly config: ConfigService,
    private readonly pathBuilderService: PathBuilderService,
  ) {}

  private buildEndpoints() {
    const endpoints: Record<string, string> = {};

    for (const [key, value] of Object.entries(apiRoutes)) {
      if (value.BASE !== apiRoutes.DOCS.BASE) {
        const camelKey = toCamelCase(key);
        endpoints[camelKey] = this.pathBuilderService.getApiPath(value.BASE);
      }
    }

    return endpoints;
  }

  getRoot() {
    return {
      status: 'ok',
      version: this.config.get<string>('API_VERSION') || '1.0.0',
      message:
        'Welcome to the API root endpoint of the my-own-photo-market backend!',
      docs: `${this.pathBuilderService.getApiPath(apiRoutes.DOCS.BASE)}`,
      endpoints: this.buildEndpoints(),
    };
  }
}
