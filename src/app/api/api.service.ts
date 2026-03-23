import { Injectable } from '@nestjs/common';
import { ApiRoutes } from '../path-builder/api.routes';
import { toCamelCase } from '../common/utils/string.utils';
import { PathBuilderService } from '../path-builder/path-builder.service';

@Injectable()
export class ApiService {
  constructor(private readonly pathBuilderService: PathBuilderService) {}

  private buildEndpoints() {
    const endpoints: Record<string, string> = {};

    for (const [key, value] of Object.entries(ApiRoutes)) {
      const camelKey = toCamelCase(key);
      endpoints[camelKey] = this.pathBuilderService.getApiPath(value.BASE);
    }

    return endpoints;
  }

  getRoot() {
    return {
      status: 'ok',
      version: '1.0.0',
      message: 'Welcome to the API root endpoint',
      docs: `${this.pathBuilderService.getApiPath(ApiRoutes.DOCS.BASE)}`,
      endpoints: this.buildEndpoints(),
    };
  }
}
