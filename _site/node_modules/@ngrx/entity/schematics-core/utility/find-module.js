(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/entity/schematics-core/utility/find-module", ["require", "exports", "@angular-devkit/core"], factory);
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
    const core_1 = require("@angular-devkit/core");
    /**
     * Find the module referred by a set of options passed to the schematics.
     */
    function findModuleFromOptions(host, options) {
        if (options.hasOwnProperty('skipImport') && options.skipImport) {
            return undefined;
        }
        if (!options.module) {
            const pathToCheck = (options.path || '') +
                (options.flat ? '' : '/' + core_1.strings.dasherize(options.name));
            return core_1.normalize(findModule(host, pathToCheck));
        }
        else {
            const modulePath = core_1.normalize('/' + options.path + '/' + options.module);
            const moduleBaseName = core_1.normalize(modulePath)
                .split('/')
                .pop();
            if (host.exists(modulePath)) {
                return core_1.normalize(modulePath);
            }
            else if (host.exists(modulePath + '.ts')) {
                return core_1.normalize(modulePath + '.ts');
            }
            else if (host.exists(modulePath + '.module.ts')) {
                return core_1.normalize(modulePath + '.module.ts');
            }
            else if (host.exists(modulePath + '/' + moduleBaseName + '.module.ts')) {
                return core_1.normalize(modulePath + '/' + moduleBaseName + '.module.ts');
            }
            else {
                throw new Error(`Specified module path ${modulePath} does not exist`);
            }
        }
    }
    exports.findModuleFromOptions = findModuleFromOptions;
    /**
     * Function to find the "closest" module to a generated file's path.
     */
    function findModule(host, generateDir) {
        let dir = host.getDir('/' + generateDir);
        const moduleRe = /\.module\.ts$/;
        const routingModuleRe = /-routing\.module\.ts/;
        while (dir) {
            const matches = dir.subfiles.filter(p => moduleRe.test(p) && !routingModuleRe.test(p));
            if (matches.length == 1) {
                return core_1.join(dir.path, matches[0]);
            }
            else if (matches.length > 1) {
                throw new Error('More than one module matches. Use skip-import option to skip importing ' +
                    'the component into the closest module.');
            }
            dir = dir.parent;
        }
        throw new Error('Could not find an NgModule. Use the skip-import ' +
            'option to skip importing in NgModule.');
    }
    exports.findModule = findModule;
    /**
     * Build a relative path from one file path to another file path.
     */
    function buildRelativePath(from, to) {
        const { path: fromPath, filename: fromFileName, directory: fromDirectory, } = parsePath(from);
        const { path: toPath, filename: toFileName, directory: toDirectory, } = parsePath(to);
        const relativePath = core_1.relative(fromDirectory, toDirectory);
        const fixedRelativePath = relativePath.startsWith('.')
            ? relativePath
            : `./${relativePath}`;
        return !toFileName || toFileName === 'index.ts'
            ? fixedRelativePath
            : `${fixedRelativePath.endsWith('/')
                ? fixedRelativePath
                : fixedRelativePath + '/'}${convertToTypeScriptFileName(toFileName)}`;
    }
    exports.buildRelativePath = buildRelativePath;
    function parsePath(path) {
        const pathNormalized = core_1.normalize(path);
        const filename = core_1.extname(pathNormalized) ? core_1.basename(pathNormalized) : '';
        const directory = filename ? core_1.dirname(pathNormalized) : pathNormalized;
        return {
            path: pathNormalized,
            filename,
            directory,
        };
    }
    /**
     * Strips the typescript extension and clears index filenames
     * foo.ts -> foo
     * index.ts -> empty
     */
    function convertToTypeScriptFileName(filename) {
        return filename ? filename.replace(/(\.ts)|(index\.ts)$/, '') : '';
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZC1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2VudGl0eS9zY2hlbWF0aWNzLWNvcmUvdXRpbGl0eS9maW5kLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILCtDQVM4QjtJQVc5Qjs7T0FFRztJQUNILFNBQWdCLHFCQUFxQixDQUNuQyxJQUFVLEVBQ1YsT0FBc0I7UUFFdEIsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFDOUQsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtZQUNuQixNQUFNLFdBQVcsR0FDZixDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO2dCQUNwQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLGNBQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFOUQsT0FBTyxnQkFBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztTQUNqRDthQUFNO1lBQ0wsTUFBTSxVQUFVLEdBQUcsZ0JBQVMsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sY0FBYyxHQUFHLGdCQUFTLENBQUMsVUFBVSxDQUFDO2lCQUN6QyxLQUFLLENBQUMsR0FBRyxDQUFDO2lCQUNWLEdBQUcsRUFBRSxDQUFDO1lBRVQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUMzQixPQUFPLGdCQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDOUI7aUJBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsRUFBRTtnQkFDMUMsT0FBTyxnQkFBUyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQzthQUN0QztpQkFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQyxFQUFFO2dCQUNqRCxPQUFPLGdCQUFTLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQyxDQUFDO2FBQzdDO2lCQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsR0FBRyxHQUFHLGNBQWMsR0FBRyxZQUFZLENBQUMsRUFBRTtnQkFDeEUsT0FBTyxnQkFBUyxDQUFDLFVBQVUsR0FBRyxHQUFHLEdBQUcsY0FBYyxHQUFHLFlBQVksQ0FBQyxDQUFDO2FBQ3BFO2lCQUFNO2dCQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLFVBQVUsaUJBQWlCLENBQUMsQ0FBQzthQUN2RTtTQUNGO0lBQ0gsQ0FBQztJQWhDRCxzREFnQ0M7SUFFRDs7T0FFRztJQUNILFNBQWdCLFVBQVUsQ0FBQyxJQUFVLEVBQUUsV0FBbUI7UUFDeEQsSUFBSSxHQUFHLEdBQW9CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQyxDQUFDO1FBRTFELE1BQU0sUUFBUSxHQUFHLGVBQWUsQ0FBQztRQUNqQyxNQUFNLGVBQWUsR0FBRyxzQkFBc0IsQ0FBQztRQUUvQyxPQUFPLEdBQUcsRUFBRTtZQUNWLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUNqQyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUNsRCxDQUFDO1lBRUYsSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtnQkFDdkIsT0FBTyxXQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNuQztpQkFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUM3QixNQUFNLElBQUksS0FBSyxDQUNiLHlFQUF5RTtvQkFDdkUsd0NBQXdDLENBQzNDLENBQUM7YUFDSDtZQUVELEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1NBQ2xCO1FBRUQsTUFBTSxJQUFJLEtBQUssQ0FDYixrREFBa0Q7WUFDaEQsdUNBQXVDLENBQzFDLENBQUM7SUFDSixDQUFDO0lBM0JELGdDQTJCQztJQUVEOztPQUVHO0lBQ0gsU0FBZ0IsaUJBQWlCLENBQUMsSUFBWSxFQUFFLEVBQVU7UUFDeEQsTUFBTSxFQUNKLElBQUksRUFBRSxRQUFRLEVBQ2QsUUFBUSxFQUFFLFlBQVksRUFDdEIsU0FBUyxFQUFFLGFBQWEsR0FDekIsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsTUFBTSxFQUNKLElBQUksRUFBRSxNQUFNLEVBQ1osUUFBUSxFQUFFLFVBQVUsRUFDcEIsU0FBUyxFQUFFLFdBQVcsR0FDdkIsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEIsTUFBTSxZQUFZLEdBQUcsZUFBUSxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMxRCxNQUFNLGlCQUFpQixHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxZQUFZO1lBQ2QsQ0FBQyxDQUFDLEtBQUssWUFBWSxFQUFFLENBQUM7UUFFeEIsT0FBTyxDQUFDLFVBQVUsSUFBSSxVQUFVLEtBQUssVUFBVTtZQUM3QyxDQUFDLENBQUMsaUJBQWlCO1lBQ25CLENBQUMsQ0FBQyxHQUNFLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7Z0JBQzdCLENBQUMsQ0FBQyxpQkFBaUI7Z0JBQ25CLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxHQUMxQixHQUFHLDJCQUEyQixDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7SUFDbkQsQ0FBQztJQXZCRCw4Q0F1QkM7SUFFRCxTQUFTLFNBQVMsQ0FBQyxJQUFZO1FBQzdCLE1BQU0sY0FBYyxHQUFHLGdCQUFTLENBQUMsSUFBSSxDQUFTLENBQUM7UUFDL0MsTUFBTSxRQUFRLEdBQUcsY0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN6RSxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLGNBQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO1FBQ3RFLE9BQU87WUFDTCxJQUFJLEVBQUUsY0FBYztZQUNwQixRQUFRO1lBQ1IsU0FBUztTQUNWLENBQUM7SUFDSixDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNILFNBQVMsMkJBQTJCLENBQUMsUUFBNEI7UUFDL0QsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNyRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgUGF0aCxcbiAgam9pbixcbiAgbm9ybWFsaXplLFxuICByZWxhdGl2ZSxcbiAgc3RyaW5ncyxcbiAgYmFzZW5hbWUsXG4gIGV4dG5hbWUsXG4gIGRpcm5hbWUsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IERpckVudHJ5LCBUcmVlIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1vZHVsZU9wdGlvbnMge1xuICBtb2R1bGU/OiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgZmxhdD86IGJvb2xlYW47XG4gIHBhdGg/OiBzdHJpbmc7XG4gIHNraXBJbXBvcnQ/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIG1vZHVsZSByZWZlcnJlZCBieSBhIHNldCBvZiBvcHRpb25zIHBhc3NlZCB0byB0aGUgc2NoZW1hdGljcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRNb2R1bGVGcm9tT3B0aW9ucyhcbiAgaG9zdDogVHJlZSxcbiAgb3B0aW9uczogTW9kdWxlT3B0aW9uc1xuKTogUGF0aCB8IHVuZGVmaW5lZCB7XG4gIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KCdza2lwSW1wb3J0JykgJiYgb3B0aW9ucy5za2lwSW1wb3J0KSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICghb3B0aW9ucy5tb2R1bGUpIHtcbiAgICBjb25zdCBwYXRoVG9DaGVjayA9XG4gICAgICAob3B0aW9ucy5wYXRoIHx8ICcnKSArXG4gICAgICAob3B0aW9ucy5mbGF0ID8gJycgOiAnLycgKyBzdHJpbmdzLmRhc2hlcml6ZShvcHRpb25zLm5hbWUpKTtcblxuICAgIHJldHVybiBub3JtYWxpemUoZmluZE1vZHVsZShob3N0LCBwYXRoVG9DaGVjaykpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG1vZHVsZVBhdGggPSBub3JtYWxpemUoJy8nICsgb3B0aW9ucy5wYXRoICsgJy8nICsgb3B0aW9ucy5tb2R1bGUpO1xuICAgIGNvbnN0IG1vZHVsZUJhc2VOYW1lID0gbm9ybWFsaXplKG1vZHVsZVBhdGgpXG4gICAgICAuc3BsaXQoJy8nKVxuICAgICAgLnBvcCgpO1xuXG4gICAgaWYgKGhvc3QuZXhpc3RzKG1vZHVsZVBhdGgpKSB7XG4gICAgICByZXR1cm4gbm9ybWFsaXplKG1vZHVsZVBhdGgpO1xuICAgIH0gZWxzZSBpZiAoaG9zdC5leGlzdHMobW9kdWxlUGF0aCArICcudHMnKSkge1xuICAgICAgcmV0dXJuIG5vcm1hbGl6ZShtb2R1bGVQYXRoICsgJy50cycpO1xuICAgIH0gZWxzZSBpZiAoaG9zdC5leGlzdHMobW9kdWxlUGF0aCArICcubW9kdWxlLnRzJykpIHtcbiAgICAgIHJldHVybiBub3JtYWxpemUobW9kdWxlUGF0aCArICcubW9kdWxlLnRzJyk7XG4gICAgfSBlbHNlIGlmIChob3N0LmV4aXN0cyhtb2R1bGVQYXRoICsgJy8nICsgbW9kdWxlQmFzZU5hbWUgKyAnLm1vZHVsZS50cycpKSB7XG4gICAgICByZXR1cm4gbm9ybWFsaXplKG1vZHVsZVBhdGggKyAnLycgKyBtb2R1bGVCYXNlTmFtZSArICcubW9kdWxlLnRzJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU3BlY2lmaWVkIG1vZHVsZSBwYXRoICR7bW9kdWxlUGF0aH0gZG9lcyBub3QgZXhpc3RgKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBGdW5jdGlvbiB0byBmaW5kIHRoZSBcImNsb3Nlc3RcIiBtb2R1bGUgdG8gYSBnZW5lcmF0ZWQgZmlsZSdzIHBhdGguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTW9kdWxlKGhvc3Q6IFRyZWUsIGdlbmVyYXRlRGlyOiBzdHJpbmcpOiBQYXRoIHtcbiAgbGV0IGRpcjogRGlyRW50cnkgfCBudWxsID0gaG9zdC5nZXREaXIoJy8nICsgZ2VuZXJhdGVEaXIpO1xuXG4gIGNvbnN0IG1vZHVsZVJlID0gL1xcLm1vZHVsZVxcLnRzJC87XG4gIGNvbnN0IHJvdXRpbmdNb2R1bGVSZSA9IC8tcm91dGluZ1xcLm1vZHVsZVxcLnRzLztcblxuICB3aGlsZSAoZGlyKSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IGRpci5zdWJmaWxlcy5maWx0ZXIoXG4gICAgICBwID0+IG1vZHVsZVJlLnRlc3QocCkgJiYgIXJvdXRpbmdNb2R1bGVSZS50ZXN0KHApXG4gICAgKTtcblxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PSAxKSB7XG4gICAgICByZXR1cm4gam9pbihkaXIucGF0aCwgbWF0Y2hlc1swXSk7XG4gICAgfSBlbHNlIGlmIChtYXRjaGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ01vcmUgdGhhbiBvbmUgbW9kdWxlIG1hdGNoZXMuIFVzZSBza2lwLWltcG9ydCBvcHRpb24gdG8gc2tpcCBpbXBvcnRpbmcgJyArXG4gICAgICAgICAgJ3RoZSBjb21wb25lbnQgaW50byB0aGUgY2xvc2VzdCBtb2R1bGUuJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBkaXIgPSBkaXIucGFyZW50O1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgICdDb3VsZCBub3QgZmluZCBhbiBOZ01vZHVsZS4gVXNlIHRoZSBza2lwLWltcG9ydCAnICtcbiAgICAgICdvcHRpb24gdG8gc2tpcCBpbXBvcnRpbmcgaW4gTmdNb2R1bGUuJ1xuICApO1xufVxuXG4vKipcbiAqIEJ1aWxkIGEgcmVsYXRpdmUgcGF0aCBmcm9tIG9uZSBmaWxlIHBhdGggdG8gYW5vdGhlciBmaWxlIHBhdGguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFJlbGF0aXZlUGF0aChmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCB7XG4gICAgcGF0aDogZnJvbVBhdGgsXG4gICAgZmlsZW5hbWU6IGZyb21GaWxlTmFtZSxcbiAgICBkaXJlY3Rvcnk6IGZyb21EaXJlY3RvcnksXG4gIH0gPSBwYXJzZVBhdGgoZnJvbSk7XG4gIGNvbnN0IHtcbiAgICBwYXRoOiB0b1BhdGgsXG4gICAgZmlsZW5hbWU6IHRvRmlsZU5hbWUsXG4gICAgZGlyZWN0b3J5OiB0b0RpcmVjdG9yeSxcbiAgfSA9IHBhcnNlUGF0aCh0byk7XG4gIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKGZyb21EaXJlY3RvcnksIHRvRGlyZWN0b3J5KTtcbiAgY29uc3QgZml4ZWRSZWxhdGl2ZVBhdGggPSByZWxhdGl2ZVBhdGguc3RhcnRzV2l0aCgnLicpXG4gICAgPyByZWxhdGl2ZVBhdGhcbiAgICA6IGAuLyR7cmVsYXRpdmVQYXRofWA7XG5cbiAgcmV0dXJuICF0b0ZpbGVOYW1lIHx8IHRvRmlsZU5hbWUgPT09ICdpbmRleC50cydcbiAgICA/IGZpeGVkUmVsYXRpdmVQYXRoXG4gICAgOiBgJHtcbiAgICAgICAgZml4ZWRSZWxhdGl2ZVBhdGguZW5kc1dpdGgoJy8nKVxuICAgICAgICAgID8gZml4ZWRSZWxhdGl2ZVBhdGhcbiAgICAgICAgICA6IGZpeGVkUmVsYXRpdmVQYXRoICsgJy8nXG4gICAgICB9JHtjb252ZXJ0VG9UeXBlU2NyaXB0RmlsZU5hbWUodG9GaWxlTmFtZSl9YDtcbn1cblxuZnVuY3Rpb24gcGFyc2VQYXRoKHBhdGg6IHN0cmluZykge1xuICBjb25zdCBwYXRoTm9ybWFsaXplZCA9IG5vcm1hbGl6ZShwYXRoKSBhcyBQYXRoO1xuICBjb25zdCBmaWxlbmFtZSA9IGV4dG5hbWUocGF0aE5vcm1hbGl6ZWQpID8gYmFzZW5hbWUocGF0aE5vcm1hbGl6ZWQpIDogJyc7XG4gIGNvbnN0IGRpcmVjdG9yeSA9IGZpbGVuYW1lID8gZGlybmFtZShwYXRoTm9ybWFsaXplZCkgOiBwYXRoTm9ybWFsaXplZDtcbiAgcmV0dXJuIHtcbiAgICBwYXRoOiBwYXRoTm9ybWFsaXplZCxcbiAgICBmaWxlbmFtZSxcbiAgICBkaXJlY3RvcnksXG4gIH07XG59XG4vKipcbiAqIFN0cmlwcyB0aGUgdHlwZXNjcmlwdCBleHRlbnNpb24gYW5kIGNsZWFycyBpbmRleCBmaWxlbmFtZXNcbiAqIGZvby50cyAtPiBmb29cbiAqIGluZGV4LnRzIC0+IGVtcHR5XG4gKi9cbmZ1bmN0aW9uIGNvbnZlcnRUb1R5cGVTY3JpcHRGaWxlTmFtZShmaWxlbmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkKSB7XG4gIHJldHVybiBmaWxlbmFtZSA/IGZpbGVuYW1lLnJlcGxhY2UoLyhcXC50cyl8KGluZGV4XFwudHMpJC8sICcnKSA6ICcnO1xufVxuIl19