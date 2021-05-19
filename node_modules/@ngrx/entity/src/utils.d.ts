import { IdSelector } from './models';
export declare function selectIdValue<T>(entity: T, selectId: IdSelector<T>): string | number;
