import { EntityState } from './models';
export declare enum DidMutate {
    EntitiesOnly = 0,
    Both = 1,
    None = 2
}
export declare function createStateOperator<V, R>(mutator: (arg: R, state: EntityState<V>) => DidMutate): EntityState<V>;
