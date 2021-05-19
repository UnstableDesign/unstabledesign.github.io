(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/entity/schematics-core/utility/ngrx-utils", ["require", "exports", "typescript", "@ngrx/entity/schematics-core/utility/strings", "@ngrx/entity/schematics-core/utility/change", "@angular-devkit/schematics", "@angular-devkit/core", "@ngrx/entity/schematics-core/utility/find-module", "@ngrx/entity/schematics-core/utility/ast-utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ts = require("typescript");
    const stringUtils = require("@ngrx/entity/schematics-core/utility/strings");
    const change_1 = require("@ngrx/entity/schematics-core/utility/change");
    const schematics_1 = require("@angular-devkit/schematics");
    const core_1 = require("@angular-devkit/core");
    const find_module_1 = require("@ngrx/entity/schematics-core/utility/find-module");
    const ast_utils_1 = require("@ngrx/entity/schematics-core/utility/ast-utils");
    function addReducerToState(options) {
        return (host) => {
            if (!options.reducers) {
                return host;
            }
            const reducersPath = core_1.normalize(`/${options.path}/${options.reducers}`);
            if (!host.exists(reducersPath)) {
                throw new Error(`Specified reducers path ${reducersPath} does not exist`);
            }
            const text = host.read(reducersPath);
            if (text === null) {
                throw new schematics_1.SchematicsException(`File ${reducersPath} does not exist.`);
            }
            const sourceText = text.toString('utf-8');
            const source = ts.createSourceFile(reducersPath, sourceText, ts.ScriptTarget.Latest, true);
            const reducerPath = `/${options.path}/` +
                (options.flat ? '' : stringUtils.dasherize(options.name) + '/') +
                (options.group ? 'reducers/' : '') +
                stringUtils.dasherize(options.name) +
                '.reducer';
            const relativePath = find_module_1.buildRelativePath(reducersPath, reducerPath);
            const reducerImport = ast_utils_1.insertImport(source, reducersPath, `* as from${stringUtils.classify(options.name)}`, relativePath, true);
            const stateInterfaceInsert = addReducerToStateInterface(source, reducersPath, options);
            const reducerMapInsert = addReducerToActionReducerMap(source, reducersPath, options);
            const changes = [reducerImport, stateInterfaceInsert, reducerMapInsert];
            const recorder = host.beginUpdate(reducersPath);
            for (const change of changes) {
                if (change instanceof change_1.InsertChange) {
                    recorder.insertLeft(change.pos, change.toAdd);
                }
            }
            host.commitUpdate(recorder);
            return host;
        };
    }
    exports.addReducerToState = addReducerToState;
    /**
     * Insert the reducer into the first defined top level interface
     */
    function addReducerToStateInterface(source, reducersPath, options) {
        const stateInterface = source.statements.find(stm => stm.kind === ts.SyntaxKind.InterfaceDeclaration);
        let node = stateInterface;
        if (!node) {
            return new change_1.NoopChange();
        }
        const state = options.plural
            ? stringUtils.pluralize(options.name)
            : stringUtils.camelize(options.name);
        const keyInsert = `[from${stringUtils.classify(options.name)}.${stringUtils.camelize(state)}FeatureKey]: from${stringUtils.classify(options.name)}.State;`;
        const expr = node;
        let position;
        let toInsert;
        if (expr.members.length === 0) {
            position = expr.getEnd() - 1;
            toInsert = `  ${keyInsert}\n`;
        }
        else {
            node = expr.members[expr.members.length - 1];
            position = node.getEnd() + 1;
            // Get the indentation of the last element, if any.
            const text = node.getFullText(source);
            const matches = text.match(/^\r?\n+(\s*)/);
            if (matches.length > 0) {
                toInsert = `${matches[1]}${keyInsert}\n`;
            }
            else {
                toInsert = `\n${keyInsert}`;
            }
        }
        return new change_1.InsertChange(reducersPath, position, toInsert);
    }
    exports.addReducerToStateInterface = addReducerToStateInterface;
    /**
     * Insert the reducer into the ActionReducerMap
     */
    function addReducerToActionReducerMap(source, reducersPath, options) {
        let initializer;
        const actionReducerMap = source.statements
            .filter(stm => stm.kind === ts.SyntaxKind.VariableStatement)
            .filter((stm) => !!stm.declarationList)
            .map((stm) => {
            const { declarations, } = stm.declarationList;
            const variable = declarations.find((decl) => decl.kind === ts.SyntaxKind.VariableDeclaration);
            const type = variable ? variable.type : {};
            return { initializer: variable.initializer, type };
        })
            .filter(initWithType => initWithType.type !== undefined)
            .find(({ type }) => type.typeName.text === 'ActionReducerMap');
        if (!actionReducerMap || !actionReducerMap.initializer) {
            return new change_1.NoopChange();
        }
        let node = actionReducerMap.initializer;
        const state = options.plural
            ? stringUtils.pluralize(options.name)
            : stringUtils.camelize(options.name);
        const keyInsert = `[from${stringUtils.classify(options.name)}.${stringUtils.camelize(state)}FeatureKey]: from${stringUtils.classify(options.name)}.reducer,`;
        const expr = node;
        let position;
        let toInsert;
        if (expr.properties.length === 0) {
            position = expr.getEnd() - 1;
            toInsert = `  ${keyInsert}\n`;
        }
        else {
            node = expr.properties[expr.properties.length - 1];
            position = node.getEnd() + 1;
            // Get the indentation of the last element, if any.
            const text = node.getFullText(source);
            const matches = text.match(/^\r?\n+(\s*)/);
            if (matches.length > 0) {
                toInsert = `\n${matches[1]}${keyInsert}`;
            }
            else {
                toInsert = `\n${keyInsert}`;
            }
        }
        return new change_1.InsertChange(reducersPath, position, toInsert);
    }
    exports.addReducerToActionReducerMap = addReducerToActionReducerMap;
    /**
     * Add reducer feature to NgModule
     */
    function addReducerImportToNgModule(options) {
        return (host) => {
            if (!options.module) {
                return host;
            }
            const modulePath = options.module;
            if (!host.exists(options.module)) {
                throw new Error(`Specified module path ${modulePath} does not exist`);
            }
            const text = host.read(modulePath);
            if (text === null) {
                throw new schematics_1.SchematicsException(`File ${modulePath} does not exist.`);
            }
            const sourceText = text.toString('utf-8');
            const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
            const commonImports = [
                ast_utils_1.insertImport(source, modulePath, 'StoreModule', '@ngrx/store'),
            ];
            const reducerPath = `/${options.path}/` +
                (options.flat ? '' : stringUtils.dasherize(options.name) + '/') +
                (options.group ? 'reducers/' : '') +
                stringUtils.dasherize(options.name) +
                '.reducer';
            const relativePath = find_module_1.buildRelativePath(modulePath, reducerPath);
            const reducerImport = ast_utils_1.insertImport(source, modulePath, `* as from${stringUtils.classify(options.name)}`, relativePath, true);
            const state = options.plural
                ? stringUtils.pluralize(options.name)
                : stringUtils.camelize(options.name);
            const [storeNgModuleImport] = ast_utils_1.addImportToModule(source, modulePath, `StoreModule.forFeature(from${stringUtils.classify(options.name)}.${state}FeatureKey, from${stringUtils.classify(options.name)}.reducer)`, relativePath);
            const changes = [...commonImports, reducerImport, storeNgModuleImport];
            const recorder = host.beginUpdate(modulePath);
            for (const change of changes) {
                if (change instanceof change_1.InsertChange) {
                    recorder.insertLeft(change.pos, change.toAdd);
                }
            }
            host.commitUpdate(recorder);
            return host;
        };
    }
    exports.addReducerImportToNgModule = addReducerImportToNgModule;
    function omit(object, keyToRemove) {
        return Object.keys(object)
            .filter(key => key !== keyToRemove)
            .reduce((result, key) => Object.assign(result, { [key]: object[key] }), {});
    }
    exports.omit = omit;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdyeC11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZW50aXR5L3NjaGVtYXRpY3MtY29yZS91dGlsaXR5L25ncngtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSxpQ0FBaUM7SUFDakMsNEVBQXlDO0lBQ3pDLHdFQUE0RDtJQUM1RCwyREFBNkU7SUFDN0UsK0NBQWlEO0lBQ2pELGtGQUFrRDtJQUNsRCw4RUFBOEQ7SUFFOUQsU0FBZ0IsaUJBQWlCLENBQUMsT0FBWTtRQUM1QyxPQUFPLENBQUMsSUFBVSxFQUFFLEVBQUU7WUFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7Z0JBQ3JCLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCxNQUFNLFlBQVksR0FBRyxnQkFBUyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUV2RSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsWUFBWSxpQkFBaUIsQ0FBQyxDQUFDO2FBQzNFO1lBRUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNyQyxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQ2pCLE1BQU0sSUFBSSxnQ0FBbUIsQ0FBQyxRQUFRLFlBQVksa0JBQWtCLENBQUMsQ0FBQzthQUN2RTtZQUVELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFMUMsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUNoQyxZQUFZLEVBQ1osVUFBVSxFQUNWLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUN0QixJQUFJLENBQ0wsQ0FBQztZ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O2FBQ3ZCLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxXQUFXLENBQUM7YUFDbEMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQVBELG9CQU9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQgKiBhcyBzdHJpbmdVdGlscyBmcm9tICcuL3N0cmluZ3MnO1xuaW1wb3J0IHsgSW5zZXJ0Q2hhbmdlLCBDaGFuZ2UsIE5vb3BDaGFuZ2UgfSBmcm9tICcuL2NoYW5nZSc7XG5pbXBvcnQgeyBUcmVlLCBTY2hlbWF0aWNzRXhjZXB0aW9uLCBSdWxlIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHsgbm9ybWFsaXplIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgYnVpbGRSZWxhdGl2ZVBhdGggfSBmcm9tICcuL2ZpbmQtbW9kdWxlJztcbmltcG9ydCB7IGFkZEltcG9ydFRvTW9kdWxlLCBpbnNlcnRJbXBvcnQgfSBmcm9tICcuL2FzdC11dGlscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRSZWR1Y2VyVG9TdGF0ZShvcHRpb25zOiBhbnkpOiBSdWxlIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlKSA9PiB7XG4gICAgaWYgKCFvcHRpb25zLnJlZHVjZXJzKSB7XG4gICAgICByZXR1cm4gaG9zdDtcbiAgICB9XG5cbiAgICBjb25zdCByZWR1Y2Vyc1BhdGggPSBub3JtYWxpemUoYC8ke29wdGlvbnMucGF0aH0vJHtvcHRpb25zLnJlZHVjZXJzfWApO1xuXG4gICAgaWYgKCFob3N0LmV4aXN0cyhyZWR1Y2Vyc1BhdGgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFNwZWNpZmllZCByZWR1Y2VycyBwYXRoICR7cmVkdWNlcnNQYXRofSBkb2VzIG5vdCBleGlzdGApO1xuICAgIH1cblxuICAgIGNvbnN0IHRleHQgPSBob3N0LnJlYWQocmVkdWNlcnNQYXRoKTtcbiAgICBpZiAodGV4dCA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYEZpbGUgJHtyZWR1Y2Vyc1BhdGh9IGRvZXMgbm90IGV4aXN0LmApO1xuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZVRleHQgPSB0ZXh0LnRvU3RyaW5nKCd1dGYtOCcpO1xuXG4gICAgY29uc3Qgc291cmNlID0gdHMuY3JlYXRlU291cmNlRmlsZShcbiAgICAgIHJlZHVjZXJzUGF0aCxcbiAgICAgIHNvdXJjZVRleHQsXG4gICAgICB0cy5TY3JpcHRUYXJnZXQuTGF0ZXN0LFxuICAgICAgdHJ1ZVxuICAgICk7XG5cbiAgICBjb25zdCByZWR1Y2VyUGF0aCA9XG4gICAgICBgLyR7b3B0aW9ucy5wYXRofS9gICtcbiAgICAgIChvcHRpb25zLmZsYXQgPyAnJyA6IHN0cmluZ1V0aWxzLmRhc2hlcml6ZShvcHRpb25zLm5hbWUpICsgJy8nKSArXG4gICAgICAob3B0aW9ucy5ncm91cCA/ICdyZWR1Y2Vycy8nIDogJycpICtcbiAgICAgIHN0cmluZ1V0aWxzLmRhc2hlcml6ZShvcHRpb25zLm5hbWUpICtcbiAgICAgICcucmVkdWNlcic7XG5cbiAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBidWlsZFJlbGF0aXZlUGF0aChyZWR1Y2Vyc1BhdGgsIHJlZHVjZXJQYXRoKTtcbiAgICBjb25zdCByZWR1Y2VySW1wb3J0ID0gaW5zZXJ0SW1wb3J0KFxuICAgICAgc291cmNlLFxuICAgICAgcmVkdWNlcnNQYXRoLFxuICAgICAgYCogYXMgZnJvbSR7c3RyaW5nVXRpbHMuY2xhc3NpZnkob3B0aW9ucy5uYW1lKX1gLFxuICAgICAgcmVsYXRpdmVQYXRoLFxuICAgICAgdHJ1ZVxuICAgICk7XG5cbiAgICBjb25zdCBzdGF0ZUludGVyZmFjZUluc2VydCA9IGFkZFJlZHVjZXJUb1N0YXRlSW50ZXJmYWNlKFxuICAgICAgc291cmNlLFxuICAgICAgcmVkdWNlcnNQYXRoLFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gICAgY29uc3QgcmVkdWNlck1hcEluc2VydCA9IGFkZFJlZHVjZXJUb0FjdGlvblJlZHVjZXJNYXAoXG4gICAgICBzb3VyY2UsXG4gICAgICByZWR1Y2Vyc1BhdGgsXG4gICAgICBvcHRpb25zXG4gICAgKTtcblxuICAgIGNvbnN0IGNoYW5nZXMgPSBbcmVkdWNlckltcG9ydCwgc3RhdGVJbnRlcmZhY2VJbnNlcnQsIHJlZHVjZXJNYXBJbnNlcnRdO1xuICAgIGNvbnN0IHJlY29yZGVyID0gaG9zdC5iZWdpblVwZGF0ZShyZWR1Y2Vyc1BhdGgpO1xuICAgIGZvciAoY29uc3QgY2hhbmdlIG9mIGNoYW5nZXMpIHtcbiAgICAgIGlmIChjaGFuZ2UgaW5zdGFuY2VvZiBJbnNlcnRDaGFuZ2UpIHtcbiAgICAgICAgcmVjb3JkZXIuaW5zZXJ0TGVmdChjaGFuZ2UucG9zLCBjaGFuZ2UudG9BZGQpO1xuICAgICAgfVxuICAgIH1cbiAgICBob3N0LmNvbW1pdFVwZGF0ZShyZWNvcmRlcik7XG5cbiAgICByZXR1cm4gaG9zdDtcbiAgfTtcbn1cblxuLyoqXG4gKiBJbnNlcnQgdGhlIHJlZHVjZXIgaW50byB0aGUgZmlyc3QgZGVmaW5lZCB0b3AgbGV2ZWwgaW50ZXJmYWNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRSZWR1Y2VyVG9TdGF0ZUludGVyZmFjZShcbiAgc291cmNlOiB0cy5Tb3VyY2VGaWxlLFxuICByZWR1Y2Vyc1BhdGg6IHN0cmluZyxcbiAgb3B0aW9uczogeyBuYW1lOiBzdHJpbmc7IHBsdXJhbDogYm9vbGVhbiB9XG4pOiBDaGFuZ2Uge1xuICBjb25zdCBzdGF0ZUludGVyZmFjZSA9IHNvdXJjZS5zdGF0ZW1lbnRzLmZpbmQoXG4gICAgc3RtID0+IHN0bS5raW5kID09PSB0cy5TeW50YXhLaW5kLkludGVyZmFjZURlY2xhcmF0aW9uXG4gICk7XG4gIGxldCBub2RlID0gc3RhdGVJbnRlcmZhY2UgYXMgdHMuU3RhdGVtZW50O1xuXG4gIGlmICghbm9kZSkge1xuICAgIHJldHVybiBuZXcgTm9vcENoYW5nZSgpO1xuICB9XG5cbiAgY29uc3Qgc3RhdGUgPSBvcHRpb25zLnBsdXJhbFxuICAgID8gc3RyaW5nVXRpbHMucGx1cmFsaXplKG9wdGlvbnMubmFtZSlcbiAgICA6IHN0cmluZ1V0aWxzLmNhbWVsaXplKG9wdGlvbnMubmFtZSk7XG5cbiAgY29uc3Qga2V5SW5zZXJ0ID0gYFtmcm9tJHtzdHJpbmdVdGlscy5jbGFzc2lmeShcbiAgICBvcHRpb25zLm5hbWVcbiAgKX0uJHtzdHJpbmdVdGlscy5jYW1lbGl6ZShzdGF0ZSl9RmVhdHVyZUtleV06IGZyb20ke3N0cmluZ1V0aWxzLmNsYXNzaWZ5KFxuICAgIG9wdGlvbnMubmFtZVxuICApfS5TdGF0ZTtgO1xuICBjb25zdCBleHByID0gbm9kZSBhcyBhbnk7XG4gIGxldCBwb3NpdGlvbjtcbiAgbGV0IHRvSW5zZXJ0O1xuXG4gIGlmIChleHByLm1lbWJlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcG9zaXRpb24gPSBleHByLmdldEVuZCgpIC0gMTtcbiAgICB0b0luc2VydCA9IGAgICR7a2V5SW5zZXJ0fVxcbmA7XG4gIH0gZWxzZSB7XG4gICAgbm9kZSA9IGV4cHIubWVtYmVyc1tleHByLm1lbWJlcnMubGVuZ3RoIC0gMV07XG4gICAgcG9zaXRpb24gPSBub2RlLmdldEVuZCgpICsgMTtcbiAgICAvLyBHZXQgdGhlIGluZGVudGF0aW9uIG9mIHRoZSBsYXN0IGVsZW1lbnQsIGlmIGFueS5cbiAgICBjb25zdCB0ZXh0ID0gbm9kZS5nZXRGdWxsVGV4dChzb3VyY2UpO1xuICAgIGNvbnN0IG1hdGNoZXMgPSB0ZXh0Lm1hdGNoKC9eXFxyP1xcbisoXFxzKikvKTtcblxuICAgIGlmIChtYXRjaGVzIS5sZW5ndGggPiAwKSB7XG4gICAgICB0b0luc2VydCA9IGAke21hdGNoZXMhWzFdfSR7a2V5SW5zZXJ0fVxcbmA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRvSW5zZXJ0ID0gYFxcbiR7a2V5SW5zZXJ0fWA7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBJbnNlcnRDaGFuZ2UocmVkdWNlcnNQYXRoLCBwb3NpdGlvbiwgdG9JbnNlcnQpO1xufVxuXG4vKipcbiAqIEluc2VydCB0aGUgcmVkdWNlciBpbnRvIHRoZSBBY3Rpb25SZWR1Y2VyTWFwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRSZWR1Y2VyVG9BY3Rpb25SZWR1Y2VyTWFwKFxuICBzb3VyY2U6IHRzLlNvdXJjZUZpbGUsXG4gIHJlZHVjZXJzUGF0aDogc3RyaW5nLFxuICBvcHRpb25zOiB7IG5hbWU6IHN0cmluZzsgcGx1cmFsOiBib29sZWFuIH1cbik6IENoYW5nZSB7XG4gIGxldCBpbml0aWFsaXplcjogYW55O1xuICBjb25zdCBhY3Rpb25SZWR1Y2VyTWFwOiBhbnkgPSBzb3VyY2Uuc3RhdGVtZW50c1xuICAgIC5maWx0ZXIoc3RtID0+IHN0bS5raW5kID09PSB0cy5TeW50YXhLaW5kLlZhcmlhYmxlU3RhdGVtZW50KVxuICAgIC5maWx0ZXIoKHN0bTogYW55KSA9PiAhIXN0bS5kZWNsYXJhdGlvbkxpc3QpXG4gICAgLm1hcCgoc3RtOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgZGVjbGFyYXRpb25zLFxuICAgICAgfToge1xuICAgICAgICBkZWNsYXJhdGlvbnM6IHRzLlN5bnRheEtpbmQuVmFyaWFibGVEZWNsYXJhdGlvbkxpc3RbXTtcbiAgICAgIH0gPSBzdG0uZGVjbGFyYXRpb25MaXN0O1xuICAgICAgY29uc3QgdmFyaWFibGU6IGFueSA9IGRlY2xhcmF0aW9ucy5maW5kKFxuICAgICAgICAoZGVjbDogYW55KSA9PiBkZWNsLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuVmFyaWFibGVEZWNsYXJhdGlvblxuICAgICAgKTtcbiAgICAgIGNvbnN0IHR5cGUgPSB2YXJpYWJsZSA/IHZhcmlhYmxlLnR5cGUgOiB7fTtcblxuICAgICAgcmV0dXJuIHsgaW5pdGlhbGl6ZXI6IHZhcmlhYmxlLmluaXRpYWxpemVyLCB0eXBlIH07XG4gICAgfSlcbiAgICAuZmlsdGVyKGluaXRXaXRoVHlwZSA9PiBpbml0V2l0aFR5cGUudHlwZSAhPT0gdW5kZWZpbmVkKVxuICAgIC5maW5kKCh7IHR5cGUgfSkgPT4gdHlwZS50eXBlTmFtZS50ZXh0ID09PSAnQWN0aW9uUmVkdWNlck1hcCcpO1xuXG4gIGlmICghYWN0aW9uUmVkdWNlck1hcCB8fCAhYWN0aW9uUmVkdWNlck1hcC5pbml0aWFsaXplcikge1xuICAgIHJldHVybiBuZXcgTm9vcENoYW5nZSgpO1xuICB9XG5cbiAgbGV0IG5vZGUgPSBhY3Rpb25SZWR1Y2VyTWFwLmluaXRpYWxpemVyO1xuXG4gIGNvbnN0IHN0YXRlID0gb3B0aW9ucy5wbHVyYWxcbiAgICA/IHN0cmluZ1V0aWxzLnBsdXJhbGl6ZShvcHRpb25zLm5hbWUpXG4gICAgOiBzdHJpbmdVdGlscy5jYW1lbGl6ZShvcHRpb25zLm5hbWUpO1xuXG4gIGNvbnN0IGtleUluc2VydCA9IGBbZnJvbSR7c3RyaW5nVXRpbHMuY2xhc3NpZnkoXG4gICAgb3B0aW9ucy5uYW1lXG4gICl9LiR7c3RyaW5nVXRpbHMuY2FtZWxpemUoc3RhdGUpfUZlYXR1cmVLZXldOiBmcm9tJHtzdHJpbmdVdGlscy5jbGFzc2lmeShcbiAgICBvcHRpb25zLm5hbWVcbiAgKX0ucmVkdWNlcixgO1xuICBjb25zdCBleHByID0gbm9kZSBhcyBhbnk7XG4gIGxldCBwb3NpdGlvbjtcbiAgbGV0IHRvSW5zZXJ0O1xuXG4gIGlmIChleHByLnByb3BlcnRpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcG9zaXRpb24gPSBleHByLmdldEVuZCgpIC0gMTtcbiAgICB0b0luc2VydCA9IGAgICR7a2V5SW5zZXJ0fVxcbmA7XG4gIH0gZWxzZSB7XG4gICAgbm9kZSA9IGV4cHIucHJvcGVydGllc1tleHByLnByb3BlcnRpZXMubGVuZ3RoIC0gMV07XG4gICAgcG9zaXRpb24gPSBub2RlLmdldEVuZCgpICsgMTtcbiAgICAvLyBHZXQgdGhlIGluZGVudGF0aW9uIG9mIHRoZSBsYXN0IGVsZW1lbnQsIGlmIGFueS5cbiAgICBjb25zdCB0ZXh0ID0gbm9kZS5nZXRGdWxsVGV4dChzb3VyY2UpO1xuICAgIGNvbnN0IG1hdGNoZXMgPSB0ZXh0Lm1hdGNoKC9eXFxyP1xcbisoXFxzKikvKTtcblxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRvSW5zZXJ0ID0gYFxcbiR7bWF0Y2hlcyFbMV19JHtrZXlJbnNlcnR9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgdG9JbnNlcnQgPSBgXFxuJHtrZXlJbnNlcnR9YDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IEluc2VydENoYW5nZShyZWR1Y2Vyc1BhdGgsIHBvc2l0aW9uLCB0b0luc2VydCk7XG59XG5cbi8qKlxuICogQWRkIHJlZHVjZXIgZmVhdHVyZSB0byBOZ01vZHVsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkUmVkdWNlckltcG9ydFRvTmdNb2R1bGUob3B0aW9uczogYW55KTogUnVsZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGlmICghb3B0aW9ucy5tb2R1bGUpIHtcbiAgICAgIHJldHVybiBob3N0O1xuICAgIH1cblxuICAgIGNvbnN0IG1vZHVsZVBhdGggPSBvcHRpb25zLm1vZHVsZTtcbiAgICBpZiAoIWhvc3QuZXhpc3RzKG9wdGlvbnMubW9kdWxlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBTcGVjaWZpZWQgbW9kdWxlIHBhdGggJHttb2R1bGVQYXRofSBkb2VzIG5vdCBleGlzdGApO1xuICAgIH1cblxuICAgIGNvbnN0IHRleHQgPSBob3N0LnJlYWQobW9kdWxlUGF0aCk7XG4gICAgaWYgKHRleHQgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBGaWxlICR7bW9kdWxlUGF0aH0gZG9lcyBub3QgZXhpc3QuYCk7XG4gICAgfVxuICAgIGNvbnN0IHNvdXJjZVRleHQgPSB0ZXh0LnRvU3RyaW5nKCd1dGYtOCcpO1xuXG4gICAgY29uc3Qgc291cmNlID0gdHMuY3JlYXRlU291cmNlRmlsZShcbiAgICAgIG1vZHVsZVBhdGgsXG4gICAgICBzb3VyY2VUZXh0LFxuICAgICAgdHMuU2NyaXB0VGFyZ2V0LkxhdGVzdCxcbiAgICAgIHRydWVcbiAgICApO1xuXG4gICAgY29uc3QgY29tbW9uSW1wb3J0cyA9IFtcbiAgICAgIGluc2VydEltcG9ydChzb3VyY2UsIG1vZHVsZVBhdGgsICdTdG9yZU1vZHVsZScsICdAbmdyeC9zdG9yZScpLFxuICAgIF07XG5cbiAgICBjb25zdCByZWR1Y2VyUGF0aCA9XG4gICAgICBgLyR7b3B0aW9ucy5wYXRofS9gICtcbiAgICAgIChvcHRpb25zLmZsYXQgPyAnJyA6IHN0cmluZ1V0aWxzLmRhc2hlcml6ZShvcHRpb25zLm5hbWUpICsgJy8nKSArXG4gICAgICAob3B0aW9ucy5ncm91cCA/ICdyZWR1Y2Vycy8nIDogJycpICtcbiAgICAgIHN0cmluZ1V0aWxzLmRhc2hlcml6ZShvcHRpb25zLm5hbWUpICtcbiAgICAgICcucmVkdWNlcic7XG4gICAgY29uc3QgcmVsYXRpdmVQYXRoID0gYnVpbGRSZWxhdGl2ZVBhdGgobW9kdWxlUGF0aCwgcmVkdWNlclBhdGgpO1xuICAgIGNvbnN0IHJlZHVjZXJJbXBvcnQgPSBpbnNlcnRJbXBvcnQoXG4gICAgICBzb3VyY2UsXG4gICAgICBtb2R1bGVQYXRoLFxuICAgICAgYCogYXMgZnJvbSR7c3RyaW5nVXRpbHMuY2xhc3NpZnkob3B0aW9ucy5uYW1lKX1gLFxuICAgICAgcmVsYXRpdmVQYXRoLFxuICAgICAgdHJ1ZVxuICAgICk7XG4gICAgY29uc3Qgc3RhdGUgPSBvcHRpb25zLnBsdXJhbFxuICAgICAgPyBzdHJpbmdVdGlscy5wbHVyYWxpemUob3B0aW9ucy5uYW1lKVxuICAgICAgOiBzdHJpbmdVdGlscy5jYW1lbGl6ZShvcHRpb25zLm5hbWUpO1xuICAgIGNvbnN0IFtzdG9yZU5nTW9kdWxlSW1wb3J0XSA9IGFkZEltcG9ydFRvTW9kdWxlKFxuICAgICAgc291cmNlLFxuICAgICAgbW9kdWxlUGF0aCxcbiAgICAgIGBTdG9yZU1vZHVsZS5mb3JGZWF0dXJlKGZyb20ke3N0cmluZ1V0aWxzLmNsYXNzaWZ5KFxuICAgICAgICBvcHRpb25zLm5hbWVcbiAgICAgICl9LiR7c3RhdGV9RmVhdHVyZUtleSwgZnJvbSR7c3RyaW5nVXRpbHMuY2xhc3NpZnkoXG4gICAgICAgIG9wdGlvbnMubmFtZVxuICAgICAgKX0ucmVkdWNlcilgLFxuICAgICAgcmVsYXRpdmVQYXRoXG4gICAgKTtcbiAgICBjb25zdCBjaGFuZ2VzID0gWy4uLmNvbW1vbkltcG9ydHMsIHJlZHVjZXJJbXBvcnQsIHN0b3JlTmdNb2R1bGVJbXBvcnRdO1xuICAgIGNvbnN0IHJlY29yZGVyID0gaG9zdC5iZWdpblVwZGF0ZShtb2R1bGVQYXRoKTtcbiAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBjaGFuZ2VzKSB7XG4gICAgICBpZiAoY2hhbmdlIGluc3RhbmNlb2YgSW5zZXJ0Q2hhbmdlKSB7XG4gICAgICAgIHJlY29yZGVyLmluc2VydExlZnQoY2hhbmdlLnBvcywgY2hhbmdlLnRvQWRkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuXG4gICAgcmV0dXJuIGhvc3Q7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvbWl0PFQgZXh0ZW5kcyB7IFtrZXk6IHN0cmluZ106IGFueSB9PihcbiAgb2JqZWN0OiBULFxuICBrZXlUb1JlbW92ZToga2V5b2YgVFxuKTogUGFydGlhbDxUPiB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmplY3QpXG4gICAgLmZpbHRlcihrZXkgPT4ga2V5ICE9PSBrZXlUb1JlbW92ZSlcbiAgICAucmVkdWNlKChyZXN1bHQsIGtleSkgPT4gT2JqZWN0LmFzc2lnbihyZXN1bHQsIHsgW2tleV06IG9iamVjdFtrZXldIH0pLCB7fSk7XG59XG4iXX0=