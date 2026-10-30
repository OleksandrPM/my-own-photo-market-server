import { Controller, Get, Render } from '@nestjs/common';
import { PathBuilderService } from './common/api/path-builder/path-builder.service';
import { apiRoutes } from './common/api/api.routes';

@Controller()
export class AppController {
  constructor(private readonly pathBuilder: PathBuilderService) {}

  @Get()
  @Render('index')
  root() {
    return {
      apiRootPath: this.pathBuilder.getApiRootPath(),
      swaggerPath: this.pathBuilder.getApiPath(apiRoutes.DOCS.BASE),
    };
  }
}
