import { WarningCode } from './warning.codes';
import { Warning, WarningArgs } from './warning.types';

class WarningServiceImpl {
  create(code: WarningCode, args?: WarningArgs): Warning {
    return args ? { code, args } : { code };
  }
}

export const warningService = new WarningServiceImpl();
export type { Warning, WarningArgs };
export { WarningCode };
