import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

  getApiPath(path: string) {
    return `${this.getApiRootPath()}/${path}`;
  }

  getApiFullPath(path: string) {
    return `${this.getRootPath()}${this.getApiPath(path)}`;
  }
}
