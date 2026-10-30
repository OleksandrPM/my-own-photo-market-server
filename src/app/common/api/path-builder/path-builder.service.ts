import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiRoutePart } from './path-builder.types';

@Injectable()
export class PathBuilderService {
  constructor(private readonly config: ConfigService) {}

  getRootPath() {
    return this.config.get<string>('APP_URL');
  }

  getApiRootPath() {
    const apiPrefix = this.config.get<string>('API_PREFIX');
    const apiVersion = this.config.get<string>('API_VERSION');

    return `/${apiPrefix}/${apiVersion}`;
  }

  getApiPath(...parts: ApiRoutePart[]) {
    return [this.getApiRootPath(), ...parts].join('/');
  }

  getApiFullPath(...parts: ApiRoutePart[]) {
    return `${this.getRootPath()}${this.getApiPath(...parts)}`;
  }
}
