(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/entity/schematics-core/utility/project", ["require", "exports", "@ngrx/entity/schematics-core/utility/config"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const config_1 = require("@ngrx/entity/schematics-core/utility/config");
    function getProject(host, options) {
        const workspace = config_1.getWorkspace(host);
        if (!options.project) {
            options.project =
                workspace.defaultProject !== undefined
                    ? workspace.defaultProject
                    : Object.keys(workspace.projects)[0];
        }
        return workspace.projects[options.project];
    }
    exports.getProject = getProject;
    function getProjectPath(host, options) {
        const project = getProject(host, options);
        if (project.root.substr(-1) === '/') {
            project.root = project.root.substr(0, project.root.length - 1);
        }
        if (options.path === undefined) {
            const projectDirName = project.projectType === 'application' ? 'app' : 'lib';
            return `${project.root ? `/${project.root}` : ''}/src/${projectDirName}`;
        }
        return options.path;
    }
    exports.getProjectPath = getProjectPath;
    function isLib(host, options) {
        const project = getProject(host, options);
        return project.projectType === 'library';
    }
    exports.isLib = isLib;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZW50aXR5L3NjaGVtYXRpY3MtY29yZS91dGlsaXR5L3Byb2plY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSx3RUFBd0M7SUFReEMsU0FBZ0IsVUFBVSxDQUN4QixJQUFVLEVBQ1YsT0FBb0U7UUFFcEUsTUFBTSxTQUFTLEdBQUcscUJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUNwQixPQUFPLENBQUMsT0FBTztnQkFDYixTQUFTLENBQUMsY0FBYyxLQUFLLFNBQVM7b0JBQ3BDLENBQUMsQ0FBQyxTQUFTLENBQUMsY0FBYztvQkFDMUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzFDO1FBRUQsT0FBTyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBZEQsZ0NBY0M7SUFFRCxTQUFnQixjQUFjLENBQzVCLElBQVUsRUFDVixPQUFvRTtRQUVwRSxNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRTFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7WUFDbkMsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDaEU7UUFFRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQzlCLE1BQU0sY0FBYyxHQUNsQixPQUFPLENBQUMsV0FBVyxLQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFFeEQsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsY0FBYyxFQUFFLENBQUM7U0FDMUU7UUFFRCxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQWxCRCx3Q0FrQkM7SUFFRCxTQUFnQixLQUFLLENBQ25CLElBQVUsRUFDVixPQUFvRTtRQUVwRSxNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRTFDLE9BQU8sT0FBTyxDQUFDLFdBQVcsS0FBSyxTQUFTLENBQUM7SUFDM0MsQ0FBQztJQVBELHNCQU9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0V29ya3NwYWNlIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgVHJlZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcblxuZXhwb3J0IGludGVyZmFjZSBXb3Jrc3BhY2VQcm9qZWN0IHtcbiAgcm9vdDogc3RyaW5nO1xuICBwcm9qZWN0VHlwZTogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvamVjdChcbiAgaG9zdDogVHJlZSxcbiAgb3B0aW9uczogeyBwcm9qZWN0Pzogc3RyaW5nIHwgdW5kZWZpbmVkOyBwYXRoPzogc3RyaW5nIHwgdW5kZWZpbmVkIH1cbik6IFdvcmtzcGFjZVByb2plY3Qge1xuICBjb25zdCB3b3Jrc3BhY2UgPSBnZXRXb3Jrc3BhY2UoaG9zdCk7XG5cbiAgaWYgKCFvcHRpb25zLnByb2plY3QpIHtcbiAgICBvcHRpb25zLnByb2plY3QgPVxuICAgICAgd29ya3NwYWNlLmRlZmF1bHRQcm9qZWN0ICE9PSB1bmRlZmluZWRcbiAgICAgICAgPyB3b3Jrc3BhY2UuZGVmYXVsdFByb2plY3RcbiAgICAgICAgOiBPYmplY3Qua2V5cyh3b3Jrc3BhY2UucHJvamVjdHMpWzBdO1xuICB9XG5cbiAgcmV0dXJuIHdvcmtzcGFjZS5wcm9qZWN0c1tvcHRpb25zLnByb2plY3RdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvamVjdFBhdGgoXG4gIGhvc3Q6IFRyZWUsXG4gIG9wdGlvbnM6IHsgcHJvamVjdD86IHN0cmluZyB8IHVuZGVmaW5lZDsgcGF0aD86IHN0cmluZyB8IHVuZGVmaW5lZCB9XG4pIHtcbiAgY29uc3QgcHJvamVjdCA9IGdldFByb2plY3QoaG9zdCwgb3B0aW9ucyk7XG5cbiAgaWYgKHByb2plY3Qucm9vdC5zdWJzdHIoLTEpID09PSAnLycpIHtcbiAgICBwcm9qZWN0LnJvb3QgPSBwcm9qZWN0LnJvb3Quc3Vic3RyKDAsIHByb2plY3Qucm9vdC5sZW5ndGggLSAxKTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLnBhdGggPT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IHByb2plY3REaXJOYW1lID1cbiAgICAgIHByb2plY3QucHJvamVjdFR5cGUgPT09ICdhcHBsaWNhdGlvbicgPyAnYXBwJyA6ICdsaWInO1xuXG4gICAgcmV0dXJuIGAke3Byb2plY3Qucm9vdCA/IGAvJHtwcm9qZWN0LnJvb3R9YCA6ICcnfS9zcmMvJHtwcm9qZWN0RGlyTmFtZX1gO1xuICB9XG5cbiAgcmV0dXJuIG9wdGlvbnMucGF0aDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTGliKFxuICBob3N0OiBUcmVlLFxuICBvcHRpb25zOiB7IHByb2plY3Q/OiBzdHJpbmcgfCB1bmRlZmluZWQ7IHBhdGg/OiBzdHJpbmcgfCB1bmRlZmluZWQgfVxuKSB7XG4gIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0KGhvc3QsIG9wdGlvbnMpO1xuXG4gIHJldHVybiBwcm9qZWN0LnByb2plY3RUeXBlID09PSAnbGlicmFyeSc7XG59XG4iXX0=