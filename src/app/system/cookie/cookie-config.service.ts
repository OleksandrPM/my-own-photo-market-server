import { toMs } from 'src/app/common/utils/time.utils';
import { CookieName, CookiesConfigMap } from './cookie.types';
import { Injectable } from '@nestjs/common';
import { PathBuilderService } from 'src/app/common/api/path-builder/path-builder.service';
import { apiRoutes } from 'src/app/common/api/api.routes';

@Injectable()
export class CookieConfigService {
  private readonly config: CookiesConfigMap;

  constructor(private readonly pathBuilder: PathBuilderService) {
    this.config = {
      [CookieName.CSRF_TOKEN]: {
        httpOnly: false,
        path: '/',
        maxAge: toMs.hours(1),
      },

      [CookieName.REFRESH_TOKEN]: {
        httpOnly: true,
        path: this.pathBuilder.getApiPath(apiRoutes.AUTH.BASE),
        maxAge: toMs.days(30),
      },

      [CookieName.DEVICE_ID]: {
        httpOnly: true,
        path: '/',
        maxAge: toMs.days(30),
      },

      [CookieName.SETUP_SESSION_ID]: {
        httpOnly: true,
        path: this.pathBuilder.getApiPath(apiRoutes.SETUP.BASE),
        maxAge: toMs.minutes(30),
      },
    };
  }

  getCookieConfig(name: CookieName): CookiesConfigMap[CookieName] {
    return this.config[name];
  }
}
