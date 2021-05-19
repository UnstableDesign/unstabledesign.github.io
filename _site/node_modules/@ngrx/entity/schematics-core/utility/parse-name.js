(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/entity/schematics-core/utility/parse-name", ["require", "exports", "@angular-devkit/core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const core_1 = require("@angular-devkit/core");
    function parseName(path, name) {
        const nameWithoutPath = core_1.basename(name);
        const namePath = core_1.dirname((path + '/' + name));
        return {
            name: nameWithoutPath,
            path: core_1.normalize('/' + namePath),
        };
    }
    exports.parseName = parseName;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UtbmFtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZW50aXR5L3NjaGVtYXRpY3MtY29yZS91dGlsaXR5L3BhcnNlLW5hbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSwrQ0FBMEU7SUFPMUUsU0FBZ0IsU0FBUyxDQUFDLElBQVksRUFBRSxJQUFZO1FBQ2xELE1BQU0sZUFBZSxHQUFHLGVBQVEsQ0FBQyxJQUFZLENBQUMsQ0FBQztRQUMvQyxNQUFNLFFBQVEsR0FBRyxjQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBUyxDQUFDLENBQUM7UUFFdEQsT0FBTztZQUNMLElBQUksRUFBRSxlQUFlO1lBQ3JCLElBQUksRUFBRSxnQkFBUyxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUM7U0FDaEMsQ0FBQztJQUNKLENBQUM7SUFSRCw4QkFRQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhdGgsIGJhc2VuYW1lLCBkaXJuYW1lLCBub3JtYWxpemUgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTG9jYXRpb24ge1xuICBuYW1lOiBzdHJpbmc7XG4gIHBhdGg6IFBhdGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU5hbWUocGF0aDogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBMb2NhdGlvbiB7XG4gIGNvbnN0IG5hbWVXaXRob3V0UGF0aCA9IGJhc2VuYW1lKG5hbWUgYXMgUGF0aCk7XG4gIGNvbnN0IG5hbWVQYXRoID0gZGlybmFtZSgocGF0aCArICcvJyArIG5hbWUpIGFzIFBhdGgpO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogbmFtZVdpdGhvdXRQYXRoLFxuICAgIHBhdGg6IG5vcm1hbGl6ZSgnLycgKyBuYW1lUGF0aCksXG4gIH07XG59XG4iXX0=