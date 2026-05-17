import { Warning } from './warning.types';

export class WarningCollector {
  private readonly warnings: Warning[] = [];

  add(warning: Warning | null | undefined) {
    if (!warning) return;

    if (!this.warnings.some((w) => w.code === warning.code)) {
      this.warnings.push(warning);
    }
  }

  getAll(): Warning[] {
    return this.warnings;
  }

  hasAny(): boolean {
    return this.warnings.length > 0;
  }
}
