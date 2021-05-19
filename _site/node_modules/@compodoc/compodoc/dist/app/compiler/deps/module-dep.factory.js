"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ModuleDepFactory = /** @class */ (function () {
    function ModuleDepFactory(moduleHelper) {
        this.moduleHelper = moduleHelper;
    }
    ModuleDepFactory.prototype.create = function (file, srcFile, name, properties, IO) {
        return {
            name: name,
            id: 'module-' + name + '-' + Date.now(),
            file: file,
            providers: this.moduleHelper.getModuleProviders(properties),
            declarations: this.moduleHelper.getModuleDeclations(properties),
            imports: this.moduleHelper.getModuleImports(properties),
            exports: this.moduleHelper.getModuleExports(properties),
            bootstrap: this.moduleHelper.getModuleBootstrap(properties),
            type: 'module',
            description: IO.description,
            sourceCode: srcFile.getText()
        };
    };
    return ModuleDepFactory;
}());
exports.ModuleDepFactory = ModuleDepFactory;
//# sourceMappingURL=module-dep.factory.js.map