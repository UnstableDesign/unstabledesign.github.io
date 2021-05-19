/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { createInitialStateFactory } from './entity_state';
import { createSelectorsFactory } from './state_selectors';
import { createSortedStateAdapter } from './sorted_state_adapter';
import { createUnsortedStateAdapter } from './unsorted_state_adapter';
/**
 * @template T
 * @param {?=} options
 * @return {?}
 */
export function createEntityAdapter(options = {}) {
    const { selectId, sortComparer } = Object.assign({ sortComparer: false, selectId: (/**
         * @param {?} instance
         * @return {?}
         */
        (instance) => instance.id) }, options);
    /** @type {?} */
    const stateFactory = createInitialStateFactory();
    /** @type {?} */
    const selectorsFactory = createSelectorsFactory();
    /** @type {?} */
    const stateAdapter = sortComparer
        ? createSortedStateAdapter(selectId, sortComparer)
        : createUnsortedStateAdapter(selectId);
    return Object.assign({ selectId,
        sortComparer }, stateFactory, selectorsFactory, stateAdapter);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlX2FkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2VudGl0eS9zcmMvY3JlYXRlX2FkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQU9BLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQzNELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2xFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7Ozs7QUFFdEUsTUFBTSxVQUFVLG1CQUFtQixDQUNqQyxVQUdJLEVBQUU7VUFFQSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsbUJBQzlCLFlBQVksRUFBRSxLQUFLLEVBQ25CLFFBQVE7Ozs7UUFBRSxDQUFDLFFBQWEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FDckMsT0FBTyxDQUNYOztVQUVLLFlBQVksR0FBRyx5QkFBeUIsRUFBSzs7VUFDN0MsZ0JBQWdCLEdBQUcsc0JBQXNCLEVBQUs7O1VBQzlDLFlBQVksR0FBRyxZQUFZO1FBQy9CLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDO1FBQ2xELENBQUMsQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLENBQUM7SUFFeEMsdUJBQ0UsUUFBUTtRQUNSLFlBQVksSUFDVCxZQUFZLEVBQ1osZ0JBQWdCLEVBQ2hCLFlBQVksRUFDZjtBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7XG4gIEVudGl0eURlZmluaXRpb24sXG4gIENvbXBhcmVyLFxuICBJZFNlbGVjdG9yLFxuICBFbnRpdHlBZGFwdGVyLFxufSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQgeyBjcmVhdGVJbml0aWFsU3RhdGVGYWN0b3J5IH0gZnJvbSAnLi9lbnRpdHlfc3RhdGUnO1xuaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3JzRmFjdG9yeSB9IGZyb20gJy4vc3RhdGVfc2VsZWN0b3JzJztcbmltcG9ydCB7IGNyZWF0ZVNvcnRlZFN0YXRlQWRhcHRlciB9IGZyb20gJy4vc29ydGVkX3N0YXRlX2FkYXB0ZXInO1xuaW1wb3J0IHsgY3JlYXRlVW5zb3J0ZWRTdGF0ZUFkYXB0ZXIgfSBmcm9tICcuL3Vuc29ydGVkX3N0YXRlX2FkYXB0ZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRW50aXR5QWRhcHRlcjxUPihcbiAgb3B0aW9uczoge1xuICAgIHNlbGVjdElkPzogSWRTZWxlY3RvcjxUPjtcbiAgICBzb3J0Q29tcGFyZXI/OiBmYWxzZSB8IENvbXBhcmVyPFQ+O1xuICB9ID0ge31cbik6IEVudGl0eUFkYXB0ZXI8VD4ge1xuICBjb25zdCB7IHNlbGVjdElkLCBzb3J0Q29tcGFyZXIgfTogRW50aXR5RGVmaW5pdGlvbjxUPiA9IHtcbiAgICBzb3J0Q29tcGFyZXI6IGZhbHNlLFxuICAgIHNlbGVjdElkOiAoaW5zdGFuY2U6IGFueSkgPT4gaW5zdGFuY2UuaWQsXG4gICAgLi4ub3B0aW9ucyxcbiAgfTtcblxuICBjb25zdCBzdGF0ZUZhY3RvcnkgPSBjcmVhdGVJbml0aWFsU3RhdGVGYWN0b3J5PFQ+KCk7XG4gIGNvbnN0IHNlbGVjdG9yc0ZhY3RvcnkgPSBjcmVhdGVTZWxlY3RvcnNGYWN0b3J5PFQ+KCk7XG4gIGNvbnN0IHN0YXRlQWRhcHRlciA9IHNvcnRDb21wYXJlclxuICAgID8gY3JlYXRlU29ydGVkU3RhdGVBZGFwdGVyKHNlbGVjdElkLCBzb3J0Q29tcGFyZXIpXG4gICAgOiBjcmVhdGVVbnNvcnRlZFN0YXRlQWRhcHRlcihzZWxlY3RJZCk7XG5cbiAgcmV0dXJuIHtcbiAgICBzZWxlY3RJZCxcbiAgICBzb3J0Q29tcGFyZXIsXG4gICAgLi4uc3RhdGVGYWN0b3J5LFxuICAgIC4uLnNlbGVjdG9yc0ZhY3RvcnksXG4gICAgLi4uc3RhdGVBZGFwdGVyLFxuICB9O1xufVxuIl19