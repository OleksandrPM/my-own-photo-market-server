import { WarningCode } from './warning.codes';

export type WarningArgs = Record<string, string | number | boolean>;

export type Warning = {
  code: WarningCode;
  args?: WarningArgs;
};
