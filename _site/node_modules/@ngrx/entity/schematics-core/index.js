(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/entity/schematics-core", ["require", "exports", "@ngrx/entity/schematics-core/utility/strings", "@ngrx/entity/schematics-core/utility/ast-utils", "@ngrx/entity/schematics-core/utility/change", "@ngrx/entity/schematics-core/utility/config", "@ngrx/entity/schematics-core/utility/find-module", "@ngrx/entity/schematics-core/utility/ngrx-utils", "@ngrx/entity/schematics-core/utility/project", "@ngrx/entity/schematics-core/utility/update", "@ngrx/entity/schematics-core/utility/parse-name", "@ngrx/entity/schematics-core/utility/package", "@ngrx/entity/schematics-core/utility/libs-version", "@ngrx/entity/schematics-core/utility/visit-utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const strings_1 = require("@ngrx/entity/schematics-core/utility/strings");
    var ast_utils_1 = require("@ngrx/entity/schematics-core/utility/ast-utils");
    exports.findNodes = ast_utils_1.findNodes;
    exports.getSourceNodes = ast_utils_1.getSourceNodes;
    exports.getDecoratorMetadata = ast_utils_1.getDecoratorMetadata;
    exports.getContentOfKeyLiteral = ast_utils_1.getContentOfKeyLiteral;
    exports.insertAfterLastOccurrence = ast_utils_1.insertAfterLastOccurrence;
    exports.insertImport = ast_utils_1.insertImport;
    exports.addBootstrapToModule = ast_utils_1.addBootstrapToModule;
    exports.addDeclarationToModule = ast_utils_1.addDeclarationToModule;
    exports.addExportToModule = ast_utils_1.addExportToModule;
    exports.addImportToModule = ast_utils_1.addImportToModule;
    exports.addProviderToModule = ast_utils_1.addProviderToModule;
    exports.replaceImport = ast_utils_1.replaceImport;
    var change_1 = require("@ngrx/entity/schematics-core/utility/change");
    exports.NoopChange = change_1.NoopChange;
    exports.InsertChange = change_1.InsertChange;
    exports.RemoveChange = change_1.RemoveChange;
    exports.ReplaceChange = change_1.ReplaceChange;
    exports.createReplaceChange = change_1.createReplaceChange;
    exports.createChangeRecorder = change_1.createChangeRecorder;
    exports.commitChanges = change_1.commitChanges;
    var config_1 = require("@ngrx/entity/schematics-core/utility/config");
    exports.getWorkspace = config_1.getWorkspace;
    exports.getWorkspacePath = config_1.getWorkspacePath;
    var find_module_1 = require("@ngrx/entity/schematics-core/utility/find-module");
    exports.findModule = find_module_1.findModule;
    exports.findModuleFromOptions = find_module_1.findModuleFromOptions;
    exports.buildRelativePath = find_module_1.buildRelativePath;
    var ngrx_utils_1 = require("@ngrx/entity/schematics-core/utility/ngrx-utils");
    exports.addReducerToState = ngrx_utils_1.addReducerToState;
    exports.addReducerToStateInterface = ngrx_utils_1.addReducerToStateInterface;
    exports.addReducerImportToNgModule = ngrx_utils_1.addReducerImportToNgModule;
    exports.addReducerToActionReducerMap = ngrx_utils_1.addReducerToActionReducerMap;
    exports.omit = ngrx_utils_1.omit;
    var project_1 = require("@ngrx/entity/schematics-core/utility/project");
    exports.getProjectPath = project_1.getProjectPath;
    exports.getProject = project_1.getProject;
    exports.isLib = project_1.isLib;
    exports.stringUtils = {
        dasherize: strings_1.dasherize,
        decamelize: strings_1.decamelize,
        camelize: strings_1.camelize,
        classify: strings_1.classify,
        underscore: strings_1.underscore,
        group: strings_1.group,
        capitalize: strings_1.capitalize,
        featurePath: strings_1.featurePath,
        pluralize: strings_1.pluralize,
    };
    var update_1 = require("@ngrx/entity/schematics-core/utility/update");
    exports.updatePackage = update_1.updatePackage;
    var parse_name_1 = require("@ngrx/entity/schematics-core/utility/parse-name");
    exports.parseName = parse_name_1.parseName;
    var package_1 = require("@ngrx/entity/schematics-core/utility/package");
    exports.addPackageToPackageJson = package_1.addPackageToPackageJson;
    var libs_version_1 = require("@ngrx/entity/schematics-core/utility/libs-version");
    exports.platformVersion = libs_version_1.platformVersion;
    var visit_utils_1 = require("@ngrx/entity/schematics-core/utility/visit-utils");
    exports.visitTSSourceFiles = visit_utils_1.visitTSSourceFiles;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2VudGl0eS9zY2hlbWF0aWNzLWNvcmUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSwwRUFVMkI7SUFFM0IsNEVBYTZCO0lBWjNCLGdDQUFBLFNBQVMsQ0FBQTtJQUNULHFDQUFBLGNBQWMsQ0FBQTtJQUNkLDJDQUFBLG9CQUFvQixDQUFBO0lBQ3BCLDZDQUFBLHNCQUFzQixDQUFBO0lBQ3RCLGdEQUFBLHlCQUF5QixDQUFBO0lBQ3pCLG1DQUFBLFlBQVksQ0FBQTtJQUNaLDJDQUFBLG9CQUFvQixDQUFBO0lBQ3BCLDZDQUFBLHNCQUFzQixDQUFBO0lBQ3RCLHdDQUFBLGlCQUFpQixDQUFBO0lBQ2pCLHdDQUFBLGlCQUFpQixDQUFBO0lBQ2pCLDBDQUFBLG1CQUFtQixDQUFBO0lBQ25CLG9DQUFBLGFBQWEsQ0FBQTtJQUdmLHNFQVUwQjtJQVB4Qiw4QkFBQSxVQUFVLENBQUE7SUFDVixnQ0FBQSxZQUFZLENBQUE7SUFDWixnQ0FBQSxZQUFZLENBQUE7SUFDWixpQ0FBQSxhQUFhLENBQUE7SUFDYix1Q0FBQSxtQkFBbUIsQ0FBQTtJQUNuQix3Q0FBQSxvQkFBb0IsQ0FBQTtJQUNwQixpQ0FBQSxhQUFhLENBQUE7SUFHZixzRUFBNkU7SUFBekQsZ0NBQUEsWUFBWSxDQUFBO0lBQUUsb0NBQUEsZ0JBQWdCLENBQUE7SUFFbEQsZ0ZBSytCO0lBSjdCLG1DQUFBLFVBQVUsQ0FBQTtJQUNWLDhDQUFBLHFCQUFxQixDQUFBO0lBQ3JCLDBDQUFBLGlCQUFpQixDQUFBO0lBSW5CLDhFQU04QjtJQUw1Qix5Q0FBQSxpQkFBaUIsQ0FBQTtJQUNqQixrREFBQSwwQkFBMEIsQ0FBQTtJQUMxQixrREFBQSwwQkFBMEIsQ0FBQTtJQUMxQixvREFBQSw0QkFBNEIsQ0FBQTtJQUM1Qiw0QkFBQSxJQUFJLENBQUE7SUFHTix3RUFBc0U7SUFBN0QsbUNBQUEsY0FBYyxDQUFBO0lBQUUsK0JBQUEsVUFBVSxDQUFBO0lBQUUsMEJBQUEsS0FBSyxDQUFBO0lBRTdCLFFBQUEsV0FBVyxHQUFHO1FBQ3pCLFNBQVMsRUFBVCxtQkFBUztRQUNULFVBQVUsRUFBVixvQkFBVTtRQUNWLFFBQVEsRUFBUixrQkFBUTtRQUNSLFFBQVEsRUFBUixrQkFBUTtRQUNSLFVBQVUsRUFBVixvQkFBVTtRQUNWLEtBQUssRUFBTCxlQUFLO1FBQ0wsVUFBVSxFQUFWLG9CQUFVO1FBQ1YsV0FBVyxFQUFYLHFCQUFXO1FBQ1gsU0FBUyxFQUFULG1CQUFTO0tBQ1YsQ0FBQztJQUVGLHNFQUFpRDtJQUF4QyxpQ0FBQSxhQUFhLENBQUE7SUFFdEIsOEVBQWlEO0lBQXhDLGlDQUFBLFNBQVMsQ0FBQTtJQUVsQix3RUFBNEQ7SUFBbkQsNENBQUEsdUJBQXVCLENBQUE7SUFFaEMsa0ZBQXlEO0lBQWhELHlDQUFBLGVBQWUsQ0FBQTtJQUV4QixnRkFBMkQ7SUFBbEQsMkNBQUEsa0JBQWtCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBkYXNoZXJpemUsXG4gIGRlY2FtZWxpemUsXG4gIGNhbWVsaXplLFxuICBjbGFzc2lmeSxcbiAgdW5kZXJzY29yZSxcbiAgZ3JvdXAsXG4gIGNhcGl0YWxpemUsXG4gIGZlYXR1cmVQYXRoLFxuICBwbHVyYWxpemUsXG59IGZyb20gJy4vdXRpbGl0eS9zdHJpbmdzJztcblxuZXhwb3J0IHtcbiAgZmluZE5vZGVzLFxuICBnZXRTb3VyY2VOb2RlcyxcbiAgZ2V0RGVjb3JhdG9yTWV0YWRhdGEsXG4gIGdldENvbnRlbnRPZktleUxpdGVyYWwsXG4gIGluc2VydEFmdGVyTGFzdE9jY3VycmVuY2UsXG4gIGluc2VydEltcG9ydCxcbiAgYWRkQm9vdHN0cmFwVG9Nb2R1bGUsXG4gIGFkZERlY2xhcmF0aW9uVG9Nb2R1bGUsXG4gIGFkZEV4cG9ydFRvTW9kdWxlLFxuICBhZGRJbXBvcnRUb01vZHVsZSxcbiAgYWRkUHJvdmlkZXJUb01vZHVsZSxcbiAgcmVwbGFjZUltcG9ydCxcbn0gZnJvbSAnLi91dGlsaXR5L2FzdC11dGlscyc7XG5cbmV4cG9ydCB7XG4gIEhvc3QsXG4gIENoYW5nZSxcbiAgTm9vcENoYW5nZSxcbiAgSW5zZXJ0Q2hhbmdlLFxuICBSZW1vdmVDaGFuZ2UsXG4gIFJlcGxhY2VDaGFuZ2UsXG4gIGNyZWF0ZVJlcGxhY2VDaGFuZ2UsXG4gIGNyZWF0ZUNoYW5nZVJlY29yZGVyLFxuICBjb21taXRDaGFuZ2VzLFxufSBmcm9tICcuL3V0aWxpdHkvY2hhbmdlJztcblxuZXhwb3J0IHsgQXBwQ29uZmlnLCBnZXRXb3Jrc3BhY2UsIGdldFdvcmtzcGFjZVBhdGggfSBmcm9tICcuL3V0aWxpdHkvY29uZmlnJztcblxuZXhwb3J0IHtcbiAgZmluZE1vZHVsZSxcbiAgZmluZE1vZHVsZUZyb21PcHRpb25zLFxuICBidWlsZFJlbGF0aXZlUGF0aCxcbiAgTW9kdWxlT3B0aW9ucyxcbn0gZnJvbSAnLi91dGlsaXR5L2ZpbmQtbW9kdWxlJztcblxuZXhwb3J0IHtcbiAgYWRkUmVkdWNlclRvU3RhdGUsXG4gIGFkZFJlZHVjZXJUb1N0YXRlSW50ZXJmYWNlLFxuICBhZGRSZWR1Y2VySW1wb3J0VG9OZ01vZHVsZSxcbiAgYWRkUmVkdWNlclRvQWN0aW9uUmVkdWNlck1hcCxcbiAgb21pdCxcbn0gZnJvbSAnLi91dGlsaXR5L25ncngtdXRpbHMnO1xuXG5leHBvcnQgeyBnZXRQcm9qZWN0UGF0aCwgZ2V0UHJvamVjdCwgaXNMaWIgfSBmcm9tICcuL3V0aWxpdHkvcHJvamVjdCc7XG5cbmV4cG9ydCBjb25zdCBzdHJpbmdVdGlscyA9IHtcbiAgZGFzaGVyaXplLFxuICBkZWNhbWVsaXplLFxuICBjYW1lbGl6ZSxcbiAgY2xhc3NpZnksXG4gIHVuZGVyc2NvcmUsXG4gIGdyb3VwLFxuICBjYXBpdGFsaXplLFxuICBmZWF0dXJlUGF0aCxcbiAgcGx1cmFsaXplLFxufTtcblxuZXhwb3J0IHsgdXBkYXRlUGFja2FnZSB9IGZyb20gJy4vdXRpbGl0eS91cGRhdGUnO1xuXG5leHBvcnQgeyBwYXJzZU5hbWUgfSBmcm9tICcuL3V0aWxpdHkvcGFyc2UtbmFtZSc7XG5cbmV4cG9ydCB7IGFkZFBhY2thZ2VUb1BhY2thZ2VKc29uIH0gZnJvbSAnLi91dGlsaXR5L3BhY2thZ2UnO1xuXG5leHBvcnQgeyBwbGF0Zm9ybVZlcnNpb24gfSBmcm9tICcuL3V0aWxpdHkvbGlicy12ZXJzaW9uJztcblxuZXhwb3J0IHsgdmlzaXRUU1NvdXJjZUZpbGVzIH0gZnJvbSAnLi91dGlsaXR5L3Zpc2l0LXV0aWxzJztcbiJdfQ==