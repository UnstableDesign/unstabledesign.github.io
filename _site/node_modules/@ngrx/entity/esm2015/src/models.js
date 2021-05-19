/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 * @template T
 */
export function DictionaryNum() { }
/**
 * @abstract
 * @template T
 */
export class Dictionary {
}
/**
 * @record
 * @template T
 */
export function UpdateStr() { }
if (false) {
    /** @type {?} */
    UpdateStr.prototype.id;
    /** @type {?} */
    UpdateStr.prototype.changes;
}
/**
 * @record
 * @template T
 */
export function UpdateNum() { }
if (false) {
    /** @type {?} */
    UpdateNum.prototype.id;
    /** @type {?} */
    UpdateNum.prototype.changes;
}
/**
 * @record
 * @template T
 */
export function EntityState() { }
if (false) {
    /** @type {?} */
    EntityState.prototype.ids;
    /** @type {?} */
    EntityState.prototype.entities;
}
/**
 * @record
 * @template T
 */
export function EntityDefinition() { }
if (false) {
    /** @type {?} */
    EntityDefinition.prototype.selectId;
    /** @type {?} */
    EntityDefinition.prototype.sortComparer;
}
/**
 * @record
 * @template T
 */
export function EntityStateAdapter() { }
if (false) {
    /**
     * @template S
     * @param {?} entity
     * @param {?} state
     * @return {?}
     */
    EntityStateAdapter.prototype.addOne = function (entity, state) { };
    /**
     * @template S
     * @param {?} entities
     * @param {?} state
     * @return {?}
     */
    EntityStateAdapter.prototype.addMany = function (entities, state) { };
    /**
     * @template S
     * @param {?} entities
     * @param {?} state
     * @return {?}
     */
    EntityStateAdapter.prototype.addAll = function (entities, state) { };
    /**
     * @template S
     * @param {?} key
     * @param {?} state
     * @return {?}
     */
    EntityStateAdapter.prototype.removeOne = function (key, state) { };
    /**
     * @template S
     * @param {?} key
     * @param {?} state
     * @return {?}
     */
    EntityStateAdapter.prototype.removeOne = function (key, state) { };
    /**
     * @template S
     * @param {?} keys
     * @param {?} state
     * @return {?}
     */
    EntityStateAdapter.prototype.removeMany = function (keys, state) { };
    /**
     * @template S
     * @param {?} keys
     * @param {?} state
     * @return {?}
     */
    EntityStateAdapter.prototype.removeMany = function (keys, state) { };
    /**
     * @template S
     * @param {?} predicate
     * @param {?} state
     * @return {?}
     */
    EntityStateAdapter.prototype.removeMany = function (predicate, state) { };
    /**
     * @template S
     * @param {?} state
     * @return {?}
     */
    EntityStateAdapter.prototype.removeAll = function (state) { };
    /**
     * @template S
     * @param {?} update
     * @param {?} state
     * @return {?}
     */
    EntityStateAdapter.prototype.updateOne = function (update, state) { };
    /**
     * @template S
     * @param {?} updates
     * @param {?} state
     * @return {?}
     */
    EntityStateAdapter.prototype.updateMany = function (updates, state) { };
    /**
     * @template S
     * @param {?} entity
     * @param {?} state
     * @return {?}
     */
    EntityStateAdapter.prototype.upsertOne = function (entity, state) { };
    /**
     * @template S
     * @param {?} entities
     * @param {?} state
     * @return {?}
     */
    EntityStateAdapter.prototype.upsertMany = function (entities, state) { };
    /**
     * @template S
     * @param {?} map
     * @param {?} state
     * @return {?}
     */
    EntityStateAdapter.prototype.map = function (map, state) { };
}
/**
 * @record
 * @template T, V
 */
export function EntitySelectors() { }
if (false) {
    /** @type {?} */
    EntitySelectors.prototype.selectIds;
    /** @type {?} */
    EntitySelectors.prototype.selectEntities;
    /** @type {?} */
    EntitySelectors.prototype.selectAll;
    /** @type {?} */
    EntitySelectors.prototype.selectTotal;
}
/**
 * @record
 * @template T
 */
export function EntityAdapter() { }
if (false) {
    /** @type {?} */
    EntityAdapter.prototype.selectId;
    /** @type {?} */
    EntityAdapter.prototype.sortComparer;
    /**
     * @return {?}
     */
    EntityAdapter.prototype.getInitialState = function () { };
    /**
     * @template S
     * @param {?} state
     * @return {?}
     */
    EntityAdapter.prototype.getInitialState = function (state) { };
    /**
     * @return {?}
     */
    EntityAdapter.prototype.getSelectors = function () { };
    /**
     * @template V
     * @param {?} selectState
     * @return {?}
     */
    EntityAdapter.prototype.getSelectors = function (selectState) { };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9lbnRpdHkvc3JjL21vZGVscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQVVBLG1DQUVDOzs7OztBQUVELE1BQU0sT0FBZ0IsVUFBVTtDQUUvQjs7Ozs7QUFFRCwrQkFHQzs7O0lBRkMsdUJBQVc7O0lBQ1gsNEJBQW9COzs7Ozs7QUFHdEIsK0JBR0M7OztJQUZDLHVCQUFXOztJQUNYLDRCQUFvQjs7Ozs7O0FBU3RCLGlDQUdDOzs7SUFGQywwQkFBeUI7O0lBQ3pCLCtCQUF3Qjs7Ozs7O0FBRzFCLHNDQUdDOzs7SUFGQyxvQ0FBd0I7O0lBQ3hCLHdDQUFrQzs7Ozs7O0FBR3BDLHdDQXFCQzs7Ozs7Ozs7SUFwQkMsbUVBQXlEOzs7Ozs7O0lBQ3pELHNFQUE4RDs7Ozs7OztJQUM5RCxxRUFBNkQ7Ozs7Ozs7SUFFN0QsbUVBQThEOzs7Ozs7O0lBQzlELG1FQUE4RDs7Ozs7OztJQUU5RCxxRUFBa0U7Ozs7Ozs7SUFDbEUscUVBQWtFOzs7Ozs7O0lBQ2xFLDBFQUEyRTs7Ozs7O0lBRTNFLDhEQUFpRDs7Ozs7OztJQUVqRCxzRUFBb0U7Ozs7Ozs7SUFDcEUsd0VBQXdFOzs7Ozs7O0lBRXhFLHNFQUE0RDs7Ozs7OztJQUM1RCx5RUFBaUU7Ozs7Ozs7SUFFakUsNkRBQThEOzs7Ozs7QUFHaEUscUNBS0M7OztJQUpDLG9DQUE2Qzs7SUFDN0MseUNBQTRDOztJQUM1QyxvQ0FBNkI7O0lBQzdCLHNDQUFrQzs7Ozs7O0FBR3BDLG1DQVNDOzs7SUFSQyxpQ0FBd0I7O0lBQ3hCLHFDQUFrQzs7OztJQUNsQywwREFBa0M7Ozs7OztJQUNsQywrREFBZ0U7Ozs7SUFDaEUsdURBQW1EOzs7Ozs7SUFDbkQsa0VBRXlCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHR5cGUgQ29tcGFyZXJTdHI8VD4gPSAoYTogVCwgYjogVCkgPT4gc3RyaW5nO1xuZXhwb3J0IHR5cGUgQ29tcGFyZXJOdW08VD4gPSAoYTogVCwgYjogVCkgPT4gbnVtYmVyO1xuXG5leHBvcnQgdHlwZSBDb21wYXJlcjxUPiA9IENvbXBhcmVyTnVtPFQ+IHwgQ29tcGFyZXJTdHI8VD47XG5cbmV4cG9ydCB0eXBlIElkU2VsZWN0b3JTdHI8VD4gPSAobW9kZWw6IFQpID0+IHN0cmluZztcbmV4cG9ydCB0eXBlIElkU2VsZWN0b3JOdW08VD4gPSAobW9kZWw6IFQpID0+IG51bWJlcjtcblxuZXhwb3J0IHR5cGUgSWRTZWxlY3RvcjxUPiA9IElkU2VsZWN0b3JTdHI8VD4gfCBJZFNlbGVjdG9yTnVtPFQ+O1xuXG5leHBvcnQgaW50ZXJmYWNlIERpY3Rpb25hcnlOdW08VD4ge1xuICBbaWQ6IG51bWJlcl06IFQgfCB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBEaWN0aW9uYXJ5PFQ+IGltcGxlbWVudHMgRGljdGlvbmFyeU51bTxUPiB7XG4gIFtpZDogc3RyaW5nXTogVCB8IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVcGRhdGVTdHI8VD4ge1xuICBpZDogc3RyaW5nO1xuICBjaGFuZ2VzOiBQYXJ0aWFsPFQ+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFVwZGF0ZU51bTxUPiB7XG4gIGlkOiBudW1iZXI7XG4gIGNoYW5nZXM6IFBhcnRpYWw8VD47XG59XG5cbmV4cG9ydCB0eXBlIFVwZGF0ZTxUPiA9IFVwZGF0ZVN0cjxUPiB8IFVwZGF0ZU51bTxUPjtcblxuZXhwb3J0IHR5cGUgUHJlZGljYXRlPFQ+ID0gKGVudGl0eTogVCkgPT4gYm9vbGVhbjtcblxuZXhwb3J0IHR5cGUgRW50aXR5TWFwPFQ+ID0gKGVudGl0eTogVCkgPT4gVDtcblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlTdGF0ZTxUPiB7XG4gIGlkczogc3RyaW5nW10gfCBudW1iZXJbXTtcbiAgZW50aXRpZXM6IERpY3Rpb25hcnk8VD47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5RGVmaW5pdGlvbjxUPiB7XG4gIHNlbGVjdElkOiBJZFNlbGVjdG9yPFQ+O1xuICBzb3J0Q29tcGFyZXI6IGZhbHNlIHwgQ29tcGFyZXI8VD47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5U3RhdGVBZGFwdGVyPFQ+IHtcbiAgYWRkT25lPFMgZXh0ZW5kcyBFbnRpdHlTdGF0ZTxUPj4oZW50aXR5OiBULCBzdGF0ZTogUyk6IFM7XG4gIGFkZE1hbnk8UyBleHRlbmRzIEVudGl0eVN0YXRlPFQ+PihlbnRpdGllczogVFtdLCBzdGF0ZTogUyk6IFM7XG4gIGFkZEFsbDxTIGV4dGVuZHMgRW50aXR5U3RhdGU8VD4+KGVudGl0aWVzOiBUW10sIHN0YXRlOiBTKTogUztcblxuICByZW1vdmVPbmU8UyBleHRlbmRzIEVudGl0eVN0YXRlPFQ+PihrZXk6IHN0cmluZywgc3RhdGU6IFMpOiBTO1xuICByZW1vdmVPbmU8UyBleHRlbmRzIEVudGl0eVN0YXRlPFQ+PihrZXk6IG51bWJlciwgc3RhdGU6IFMpOiBTO1xuXG4gIHJlbW92ZU1hbnk8UyBleHRlbmRzIEVudGl0eVN0YXRlPFQ+PihrZXlzOiBzdHJpbmdbXSwgc3RhdGU6IFMpOiBTO1xuICByZW1vdmVNYW55PFMgZXh0ZW5kcyBFbnRpdHlTdGF0ZTxUPj4oa2V5czogbnVtYmVyW10sIHN0YXRlOiBTKTogUztcbiAgcmVtb3ZlTWFueTxTIGV4dGVuZHMgRW50aXR5U3RhdGU8VD4+KHByZWRpY2F0ZTogUHJlZGljYXRlPFQ+LCBzdGF0ZTogUyk6IFM7XG5cbiAgcmVtb3ZlQWxsPFMgZXh0ZW5kcyBFbnRpdHlTdGF0ZTxUPj4oc3RhdGU6IFMpOiBTO1xuXG4gIHVwZGF0ZU9uZTxTIGV4dGVuZHMgRW50aXR5U3RhdGU8VD4+KHVwZGF0ZTogVXBkYXRlPFQ+LCBzdGF0ZTogUyk6IFM7XG4gIHVwZGF0ZU1hbnk8UyBleHRlbmRzIEVudGl0eVN0YXRlPFQ+Pih1cGRhdGVzOiBVcGRhdGU8VD5bXSwgc3RhdGU6IFMpOiBTO1xuXG4gIHVwc2VydE9uZTxTIGV4dGVuZHMgRW50aXR5U3RhdGU8VD4+KGVudGl0eTogVCwgc3RhdGU6IFMpOiBTO1xuICB1cHNlcnRNYW55PFMgZXh0ZW5kcyBFbnRpdHlTdGF0ZTxUPj4oZW50aXRpZXM6IFRbXSwgc3RhdGU6IFMpOiBTO1xuXG4gIG1hcDxTIGV4dGVuZHMgRW50aXR5U3RhdGU8VD4+KG1hcDogRW50aXR5TWFwPFQ+LCBzdGF0ZTogUyk6IFM7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5U2VsZWN0b3JzPFQsIFY+IHtcbiAgc2VsZWN0SWRzOiAoc3RhdGU6IFYpID0+IHN0cmluZ1tdIHwgbnVtYmVyW107XG4gIHNlbGVjdEVudGl0aWVzOiAoc3RhdGU6IFYpID0+IERpY3Rpb25hcnk8VD47XG4gIHNlbGVjdEFsbDogKHN0YXRlOiBWKSA9PiBUW107XG4gIHNlbGVjdFRvdGFsOiAoc3RhdGU6IFYpID0+IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlBZGFwdGVyPFQ+IGV4dGVuZHMgRW50aXR5U3RhdGVBZGFwdGVyPFQ+IHtcbiAgc2VsZWN0SWQ6IElkU2VsZWN0b3I8VD47XG4gIHNvcnRDb21wYXJlcjogZmFsc2UgfCBDb21wYXJlcjxUPjtcbiAgZ2V0SW5pdGlhbFN0YXRlKCk6IEVudGl0eVN0YXRlPFQ+O1xuICBnZXRJbml0aWFsU3RhdGU8UyBleHRlbmRzIG9iamVjdD4oc3RhdGU6IFMpOiBFbnRpdHlTdGF0ZTxUPiAmIFM7XG4gIGdldFNlbGVjdG9ycygpOiBFbnRpdHlTZWxlY3RvcnM8VCwgRW50aXR5U3RhdGU8VD4+O1xuICBnZXRTZWxlY3RvcnM8Vj4oXG4gICAgc2VsZWN0U3RhdGU6IChzdGF0ZTogVikgPT4gRW50aXR5U3RhdGU8VD5cbiAgKTogRW50aXR5U2VsZWN0b3JzPFQsIFY+O1xufVxuIl19