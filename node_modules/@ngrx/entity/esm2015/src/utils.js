/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { isDevMode } from '@angular/core';
/**
 * @template T
 * @param {?} entity
 * @param {?} selectId
 * @return {?}
 */
export function selectIdValue(entity, selectId) {
    /** @type {?} */
    const key = selectId(entity);
    if (isDevMode() && key === undefined) {
        console.warn('@ngrx/entity: The entity passed to the `selectId` implementation returned undefined.', 'You should probably provide your own `selectId` implementation.', 'The entity that was passed:', entity, 'The `selectId` implementation:', selectId.toString());
    }
    return key;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2VudGl0eS9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7Ozs7QUFHMUMsTUFBTSxVQUFVLGFBQWEsQ0FBSSxNQUFTLEVBQUUsUUFBdUI7O1VBQzNELEdBQUcsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0lBRTVCLElBQUksU0FBUyxFQUFFLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtRQUNwQyxPQUFPLENBQUMsSUFBSSxDQUNWLHNGQUFzRixFQUN0RixpRUFBaUUsRUFDakUsNkJBQTZCLEVBQzdCLE1BQU0sRUFDTixnQ0FBZ0MsRUFDaEMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUNwQixDQUFDO0tBQ0g7SUFFRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc0Rldk1vZGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElkU2VsZWN0b3IgfSBmcm9tICcuL21vZGVscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RJZFZhbHVlPFQ+KGVudGl0eTogVCwgc2VsZWN0SWQ6IElkU2VsZWN0b3I8VD4pIHtcbiAgY29uc3Qga2V5ID0gc2VsZWN0SWQoZW50aXR5KTtcblxuICBpZiAoaXNEZXZNb2RlKCkgJiYga2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICBjb25zb2xlLndhcm4oXG4gICAgICAnQG5ncngvZW50aXR5OiBUaGUgZW50aXR5IHBhc3NlZCB0byB0aGUgYHNlbGVjdElkYCBpbXBsZW1lbnRhdGlvbiByZXR1cm5lZCB1bmRlZmluZWQuJyxcbiAgICAgICdZb3Ugc2hvdWxkIHByb2JhYmx5IHByb3ZpZGUgeW91ciBvd24gYHNlbGVjdElkYCBpbXBsZW1lbnRhdGlvbi4nLFxuICAgICAgJ1RoZSBlbnRpdHkgdGhhdCB3YXMgcGFzc2VkOicsXG4gICAgICBlbnRpdHksXG4gICAgICAnVGhlIGBzZWxlY3RJZGAgaW1wbGVtZW50YXRpb246JyxcbiAgICAgIHNlbGVjdElkLnRvU3RyaW5nKClcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIGtleTtcbn1cbiJdfQ==