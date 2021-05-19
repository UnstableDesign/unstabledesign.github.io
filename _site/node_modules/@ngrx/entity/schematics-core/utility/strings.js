(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/entity/schematics-core/utility/strings", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    const STRING_DASHERIZE_REGEXP = /[ _]/g;
    const STRING_DECAMELIZE_REGEXP = /([a-z\d])([A-Z])/g;
    const STRING_CAMELIZE_REGEXP = /(-|_|\.|\s)+(.)?/g;
    const STRING_UNDERSCORE_REGEXP_1 = /([a-z\d])([A-Z]+)/g;
    const STRING_UNDERSCORE_REGEXP_2 = /-|\s+/g;
    /**
     * Converts a camelized string into all lower case separated by underscores.
     *
     ```javascript
     decamelize('innerHTML');         // 'inner_html'
     decamelize('action_name');       // 'action_name'
     decamelize('css-class-name');    // 'css-class-name'
     decamelize('my favorite items'); // 'my favorite items'
     ```
     */
    function decamelize(str) {
        return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
    }
    exports.decamelize = decamelize;
    /**
     Replaces underscores, spaces, or camelCase with dashes.
    
     ```javascript
     dasherize('innerHTML');         // 'inner-html'
     dasherize('action_name');       // 'action-name'
     dasherize('css-class-name');    // 'css-class-name'
     dasherize('my favorite items'); // 'my-favorite-items'
     ```
     */
    function dasherize(str) {
        return decamelize(str || '').replace(STRING_DASHERIZE_REGEXP, '-');
    }
    exports.dasherize = dasherize;
    /**
     Returns the lowerCamelCase form of a string.
    
     ```javascript
     camelize('innerHTML');          // 'innerHTML'
     camelize('action_name');        // 'actionName'
     camelize('css-class-name');     // 'cssClassName'
     camelize('my favorite items');  // 'myFavoriteItems'
     camelize('My Favorite Items');  // 'myFavoriteItems'
     ```
     */
    function camelize(str) {
        return str
            .replace(STRING_CAMELIZE_REGEXP, (_match, _separator, chr) => {
            return chr ? chr.toUpperCase() : '';
        })
            .replace(/^([A-Z])/, (match) => match.toLowerCase());
    }
    exports.camelize = camelize;
    /**
     Returns the UpperCamelCase form of a string.
    
     ```javascript
     'innerHTML'.classify();          // 'InnerHTML'
     'action_name'.classify();        // 'ActionName'
     'css-class-name'.classify();     // 'CssClassName'
     'my favorite items'.classify();  // 'MyFavoriteItems'
     ```
     */
    function classify(str) {
        return str
            .split('.')
            .map(part => capitalize(camelize(part)))
            .join('.');
    }
    exports.classify = classify;
    /**
     More general than decamelize. Returns the lower\_case\_and\_underscored
     form of a string.
    
     ```javascript
     'innerHTML'.underscore();          // 'inner_html'
     'action_name'.underscore();        // 'action_name'
     'css-class-name'.underscore();     // 'css_class_name'
     'my favorite items'.underscore();  // 'my_favorite_items'
     ```
     */
    function underscore(str) {
        return str
            .replace(STRING_UNDERSCORE_REGEXP_1, '$1_$2')
            .replace(STRING_UNDERSCORE_REGEXP_2, '_')
            .toLowerCase();
    }
    exports.underscore = underscore;
    /**
     Returns the Capitalized form of a string
    
     ```javascript
     'innerHTML'.capitalize()         // 'InnerHTML'
     'action_name'.capitalize()       // 'Action_name'
     'css-class-name'.capitalize()    // 'Css-class-name'
     'my favorite items'.capitalize() // 'My favorite items'
     ```
     */
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.substr(1);
    }
    exports.capitalize = capitalize;
    /**
     Returns the plural form of a string
    
     ```javascript
     'innerHTML'.pluralize()         // 'innerHTMLs'
     'action_name'.pluralize()       // 'actionNames'
     'css-class-name'.pluralize()    // 'cssClassNames'
     'regex'.pluralize()            // 'regexes'
     'user'.pluralize()             // 'users'
     ```
     */
    function pluralize(str) {
        return camelize([/([^aeiou])y$/, /()fe?$/, /([^aeiou]o|[sxz]|[cs]h)$/].map((c, i) => (str = str.replace(c, `$1${'iv'[i] || ''}e`))) && str + 's');
    }
    exports.pluralize = pluralize;
    function group(name, group) {
        return group ? `${group}/${name}` : name;
    }
    exports.group = group;
    function featurePath(group, flat, path, name) {
        if (group && !flat) {
            return `../../${path}/${name}/`;
        }
        return group ? `../${path}/` : './';
    }
    exports.featurePath = featurePath;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZW50aXR5L3NjaGVtYXRpY3MtY29yZS91dGlsaXR5L3N0cmluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCxNQUFNLHVCQUF1QixHQUFHLE9BQU8sQ0FBQztJQUN4QyxNQUFNLHdCQUF3QixHQUFHLG1CQUFtQixDQUFDO0lBQ3JELE1BQU0sc0JBQXNCLEdBQUcsbUJBQW1CLENBQUM7SUFDbkQsTUFBTSwwQkFBMEIsR0FBRyxvQkFBb0IsQ0FBQztJQUN4RCxNQUFNLDBCQUEwQixHQUFHLFFBQVEsQ0FBQztJQUU1Qzs7Ozs7Ozs7O09BU0c7SUFDSCxTQUFnQixVQUFVLENBQUMsR0FBVztRQUNwQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEVBQUUsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdEUsQ0FBQztJQUZELGdDQUVDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsU0FBZ0IsU0FBUyxDQUFDLEdBQVk7UUFDcEMsT0FBTyxVQUFVLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRkQsOEJBRUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0gsU0FBZ0IsUUFBUSxDQUFDLEdBQVc7UUFDbEMsT0FBTyxHQUFHO2FBQ1AsT0FBTyxDQUNOLHNCQUFzQixFQUN0QixDQUFDLE1BQWMsRUFBRSxVQUFrQixFQUFFLEdBQVcsRUFBRSxFQUFFO1lBQ2xELE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN0QyxDQUFDLENBQ0Y7YUFDQSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBYSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBVEQsNEJBU0M7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSCxTQUFnQixRQUFRLENBQUMsR0FBVztRQUNsQyxPQUFPLEdBQUc7YUFDUCxLQUFLLENBQUMsR0FBRyxDQUFDO2FBQ1YsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ3ZDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7SUFMRCw0QkFLQztJQUVEOzs7Ozs7Ozs7O09BVUc7SUFDSCxTQUFnQixVQUFVLENBQUMsR0FBVztRQUNwQyxPQUFPLEdBQUc7YUFDUCxPQUFPLENBQUMsMEJBQTBCLEVBQUUsT0FBTyxDQUFDO2FBQzVDLE9BQU8sQ0FBQywwQkFBMEIsRUFBRSxHQUFHLENBQUM7YUFDeEMsV0FBVyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUxELGdDQUtDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsU0FBZ0IsVUFBVSxDQUFDLEdBQVc7UUFDcEMsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUZELGdDQUVDO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNILFNBQWdCLFNBQVMsQ0FBQyxHQUFXO1FBQ25DLE9BQU8sUUFBUSxDQUNiLENBQUMsY0FBYyxFQUFFLFFBQVEsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDLEdBQUcsQ0FDeEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQ3hELElBQUksR0FBRyxHQUFHLEdBQUcsQ0FDZixDQUFDO0lBQ0osQ0FBQztJQU5ELDhCQU1DO0lBRUQsU0FBZ0IsS0FBSyxDQUFDLElBQVksRUFBRSxLQUF5QjtRQUMzRCxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUMzQyxDQUFDO0lBRkQsc0JBRUM7SUFFRCxTQUFnQixXQUFXLENBQ3pCLEtBQTBCLEVBQzFCLElBQXlCLEVBQ3pCLElBQVksRUFDWixJQUFZO1FBRVosSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDbEIsT0FBTyxTQUFTLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQztTQUNqQztRQUVELE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDdEMsQ0FBQztJQVhELGtDQVdDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuY29uc3QgU1RSSU5HX0RBU0hFUklaRV9SRUdFWFAgPSAvWyBfXS9nO1xuY29uc3QgU1RSSU5HX0RFQ0FNRUxJWkVfUkVHRVhQID0gLyhbYS16XFxkXSkoW0EtWl0pL2c7XG5jb25zdCBTVFJJTkdfQ0FNRUxJWkVfUkVHRVhQID0gLygtfF98XFwufFxccykrKC4pPy9nO1xuY29uc3QgU1RSSU5HX1VOREVSU0NPUkVfUkVHRVhQXzEgPSAvKFthLXpcXGRdKShbQS1aXSspL2c7XG5jb25zdCBTVFJJTkdfVU5ERVJTQ09SRV9SRUdFWFBfMiA9IC8tfFxccysvZztcblxuLyoqXG4gKiBDb252ZXJ0cyBhIGNhbWVsaXplZCBzdHJpbmcgaW50byBhbGwgbG93ZXIgY2FzZSBzZXBhcmF0ZWQgYnkgdW5kZXJzY29yZXMuXG4gKlxuIGBgYGphdmFzY3JpcHRcbiBkZWNhbWVsaXplKCdpbm5lckhUTUwnKTsgICAgICAgICAvLyAnaW5uZXJfaHRtbCdcbiBkZWNhbWVsaXplKCdhY3Rpb25fbmFtZScpOyAgICAgICAvLyAnYWN0aW9uX25hbWUnXG4gZGVjYW1lbGl6ZSgnY3NzLWNsYXNzLW5hbWUnKTsgICAgLy8gJ2Nzcy1jbGFzcy1uYW1lJ1xuIGRlY2FtZWxpemUoJ215IGZhdm9yaXRlIGl0ZW1zJyk7IC8vICdteSBmYXZvcml0ZSBpdGVtcydcbiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlY2FtZWxpemUoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoU1RSSU5HX0RFQ0FNRUxJWkVfUkVHRVhQLCAnJDFfJDInKS50b0xvd2VyQ2FzZSgpO1xufVxuXG4vKipcbiBSZXBsYWNlcyB1bmRlcnNjb3Jlcywgc3BhY2VzLCBvciBjYW1lbENhc2Ugd2l0aCBkYXNoZXMuXG5cbiBgYGBqYXZhc2NyaXB0XG4gZGFzaGVyaXplKCdpbm5lckhUTUwnKTsgICAgICAgICAvLyAnaW5uZXItaHRtbCdcbiBkYXNoZXJpemUoJ2FjdGlvbl9uYW1lJyk7ICAgICAgIC8vICdhY3Rpb24tbmFtZSdcbiBkYXNoZXJpemUoJ2Nzcy1jbGFzcy1uYW1lJyk7ICAgIC8vICdjc3MtY2xhc3MtbmFtZSdcbiBkYXNoZXJpemUoJ215IGZhdm9yaXRlIGl0ZW1zJyk7IC8vICdteS1mYXZvcml0ZS1pdGVtcydcbiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRhc2hlcml6ZShzdHI/OiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gZGVjYW1lbGl6ZShzdHIgfHwgJycpLnJlcGxhY2UoU1RSSU5HX0RBU0hFUklaRV9SRUdFWFAsICctJyk7XG59XG5cbi8qKlxuIFJldHVybnMgdGhlIGxvd2VyQ2FtZWxDYXNlIGZvcm0gb2YgYSBzdHJpbmcuXG5cbiBgYGBqYXZhc2NyaXB0XG4gY2FtZWxpemUoJ2lubmVySFRNTCcpOyAgICAgICAgICAvLyAnaW5uZXJIVE1MJ1xuIGNhbWVsaXplKCdhY3Rpb25fbmFtZScpOyAgICAgICAgLy8gJ2FjdGlvbk5hbWUnXG4gY2FtZWxpemUoJ2Nzcy1jbGFzcy1uYW1lJyk7ICAgICAvLyAnY3NzQ2xhc3NOYW1lJ1xuIGNhbWVsaXplKCdteSBmYXZvcml0ZSBpdGVtcycpOyAgLy8gJ215RmF2b3JpdGVJdGVtcydcbiBjYW1lbGl6ZSgnTXkgRmF2b3JpdGUgSXRlbXMnKTsgIC8vICdteUZhdm9yaXRlSXRlbXMnXG4gYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW1lbGl6ZShzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzdHJcbiAgICAucmVwbGFjZShcbiAgICAgIFNUUklOR19DQU1FTElaRV9SRUdFWFAsXG4gICAgICAoX21hdGNoOiBzdHJpbmcsIF9zZXBhcmF0b3I6IHN0cmluZywgY2hyOiBzdHJpbmcpID0+IHtcbiAgICAgICAgcmV0dXJuIGNociA/IGNoci50b1VwcGVyQ2FzZSgpIDogJyc7XG4gICAgICB9XG4gICAgKVxuICAgIC5yZXBsYWNlKC9eKFtBLVpdKS8sIChtYXRjaDogc3RyaW5nKSA9PiBtYXRjaC50b0xvd2VyQ2FzZSgpKTtcbn1cblxuLyoqXG4gUmV0dXJucyB0aGUgVXBwZXJDYW1lbENhc2UgZm9ybSBvZiBhIHN0cmluZy5cblxuIGBgYGphdmFzY3JpcHRcbiAnaW5uZXJIVE1MJy5jbGFzc2lmeSgpOyAgICAgICAgICAvLyAnSW5uZXJIVE1MJ1xuICdhY3Rpb25fbmFtZScuY2xhc3NpZnkoKTsgICAgICAgIC8vICdBY3Rpb25OYW1lJ1xuICdjc3MtY2xhc3MtbmFtZScuY2xhc3NpZnkoKTsgICAgIC8vICdDc3NDbGFzc05hbWUnXG4gJ215IGZhdm9yaXRlIGl0ZW1zJy5jbGFzc2lmeSgpOyAgLy8gJ015RmF2b3JpdGVJdGVtcydcbiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzaWZ5KHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHN0clxuICAgIC5zcGxpdCgnLicpXG4gICAgLm1hcChwYXJ0ID0+IGNhcGl0YWxpemUoY2FtZWxpemUocGFydCkpKVxuICAgIC5qb2luKCcuJyk7XG59XG5cbi8qKlxuIE1vcmUgZ2VuZXJhbCB0aGFuIGRlY2FtZWxpemUuIFJldHVybnMgdGhlIGxvd2VyXFxfY2FzZVxcX2FuZFxcX3VuZGVyc2NvcmVkXG4gZm9ybSBvZiBhIHN0cmluZy5cblxuIGBgYGphdmFzY3JpcHRcbiAnaW5uZXJIVE1MJy51bmRlcnNjb3JlKCk7ICAgICAgICAgIC8vICdpbm5lcl9odG1sJ1xuICdhY3Rpb25fbmFtZScudW5kZXJzY29yZSgpOyAgICAgICAgLy8gJ2FjdGlvbl9uYW1lJ1xuICdjc3MtY2xhc3MtbmFtZScudW5kZXJzY29yZSgpOyAgICAgLy8gJ2Nzc19jbGFzc19uYW1lJ1xuICdteSBmYXZvcml0ZSBpdGVtcycudW5kZXJzY29yZSgpOyAgLy8gJ215X2Zhdm9yaXRlX2l0ZW1zJ1xuIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5kZXJzY29yZShzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzdHJcbiAgICAucmVwbGFjZShTVFJJTkdfVU5ERVJTQ09SRV9SRUdFWFBfMSwgJyQxXyQyJylcbiAgICAucmVwbGFjZShTVFJJTkdfVU5ERVJTQ09SRV9SRUdFWFBfMiwgJ18nKVxuICAgIC50b0xvd2VyQ2FzZSgpO1xufVxuXG4vKipcbiBSZXR1cm5zIHRoZSBDYXBpdGFsaXplZCBmb3JtIG9mIGEgc3RyaW5nXG5cbiBgYGBqYXZhc2NyaXB0XG4gJ2lubmVySFRNTCcuY2FwaXRhbGl6ZSgpICAgICAgICAgLy8gJ0lubmVySFRNTCdcbiAnYWN0aW9uX25hbWUnLmNhcGl0YWxpemUoKSAgICAgICAvLyAnQWN0aW9uX25hbWUnXG4gJ2Nzcy1jbGFzcy1uYW1lJy5jYXBpdGFsaXplKCkgICAgLy8gJ0Nzcy1jbGFzcy1uYW1lJ1xuICdteSBmYXZvcml0ZSBpdGVtcycuY2FwaXRhbGl6ZSgpIC8vICdNeSBmYXZvcml0ZSBpdGVtcydcbiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemUoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnN1YnN0cigxKTtcbn1cblxuLyoqXG4gUmV0dXJucyB0aGUgcGx1cmFsIGZvcm0gb2YgYSBzdHJpbmdcblxuIGBgYGphdmFzY3JpcHRcbiAnaW5uZXJIVE1MJy5wbHVyYWxpemUoKSAgICAgICAgIC8vICdpbm5lckhUTUxzJ1xuICdhY3Rpb25fbmFtZScucGx1cmFsaXplKCkgICAgICAgLy8gJ2FjdGlvbk5hbWVzJ1xuICdjc3MtY2xhc3MtbmFtZScucGx1cmFsaXplKCkgICAgLy8gJ2Nzc0NsYXNzTmFtZXMnXG4gJ3JlZ2V4Jy5wbHVyYWxpemUoKSAgICAgICAgICAgIC8vICdyZWdleGVzJ1xuICd1c2VyJy5wbHVyYWxpemUoKSAgICAgICAgICAgICAvLyAndXNlcnMnXG4gYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwbHVyYWxpemUoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gY2FtZWxpemUoXG4gICAgWy8oW15hZWlvdV0peSQvLCAvKClmZT8kLywgLyhbXmFlaW91XW98W3N4el18W2NzXWgpJC9dLm1hcChcbiAgICAgIChjLCBpKSA9PiAoc3RyID0gc3RyLnJlcGxhY2UoYywgYCQxJHsnaXYnW2ldIHx8ICcnfWVgKSlcbiAgICApICYmIHN0ciArICdzJ1xuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ3JvdXAobmFtZTogc3RyaW5nLCBncm91cDogc3RyaW5nIHwgdW5kZWZpbmVkKSB7XG4gIHJldHVybiBncm91cCA/IGAke2dyb3VwfS8ke25hbWV9YCA6IG5hbWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZWF0dXJlUGF0aChcbiAgZ3JvdXA6IGJvb2xlYW4gfCB1bmRlZmluZWQsXG4gIGZsYXQ6IGJvb2xlYW4gfCB1bmRlZmluZWQsXG4gIHBhdGg6IHN0cmluZyxcbiAgbmFtZTogc3RyaW5nXG4pIHtcbiAgaWYgKGdyb3VwICYmICFmbGF0KSB7XG4gICAgcmV0dXJuIGAuLi8uLi8ke3BhdGh9LyR7bmFtZX0vYDtcbiAgfVxuXG4gIHJldHVybiBncm91cCA/IGAuLi8ke3BhdGh9L2AgOiAnLi8nO1xufVxuIl19