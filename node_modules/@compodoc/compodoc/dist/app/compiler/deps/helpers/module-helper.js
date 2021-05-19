"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var symbol_helper_1 = require("./symbol-helper");
var ModuleHelper = /** @class */ (function () {
    function ModuleHelper(cache, symbolHelper) {
        if (symbolHelper === void 0) { symbolHelper = new symbol_helper_1.SymbolHelper(); }
        this.cache = cache;
        this.symbolHelper = symbolHelper;
    }
    ModuleHelper.prototype.getModuleProviders = function (properties) {
        var _this = this;
        return this.symbolHelper
            .getSymbolDeps(properties, 'providers')
            .map(function (providerName) { return _this.symbolHelper.parseDeepIndentifier(providerName); });
    };
    ModuleHelper.prototype.getModuleDeclations = function (props) {
        var _this = this;
        return this.symbolHelper.getSymbolDeps(props, 'declarations').map(function (name) {
            var component = _this.cache.get(name);
            if (component) {
                return component;
            }
            return _this.symbolHelper.parseDeepIndentifier(name);
        });
    };
    ModuleHelper.prototype.getModuleImports = function (props) {
        var _this = this;
        return this.symbolHelper
            .getSymbolDeps(props, 'imports')
            .map(function (name) { return _this.symbolHelper.parseDeepIndentifier(name); });
    };
    ModuleHelper.prototype.getModuleExports = function (props) {
        var _this = this;
        return this.symbolHelper
            .getSymbolDeps(props, 'exports')
            .map(function (name) { return _this.symbolHelper.parseDeepIndentifier(name); });
    };
    ModuleHelper.prototype.getModuleImportsRaw = function (props) {
        return this.symbolHelper.getSymbolDepsRaw(props, 'imports');
    };
    ModuleHelper.prototype.getModuleBootstrap = function (props) {
        var _this = this;
        return this.symbolHelper
            .getSymbolDeps(props, 'bootstrap')
            .map(function (name) { return _this.symbolHelper.parseDeepIndentifier(name); });
    };
    return ModuleHelper;
}());
exports.ModuleHelper = ModuleHelper;
//# sourceMappingURL=module-helper.js.map