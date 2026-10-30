import { apiRoutes } from '../api.routes';

export type NestedValues<T> = T extends string
  ? T
  : T extends object
    ? NestedValues<T[keyof T]>
    : never;

export type ApiRoutePart = NestedValues<typeof apiRoutes>;
