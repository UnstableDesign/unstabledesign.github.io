"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../utils/utils");
var DirectiveDepFactory = /** @class */ (function () {
    function DirectiveDepFactory(helper, configuration) {
        this.helper = helper;
        this.configuration = configuration;
    }
    DirectiveDepFactory.prototype.create = function (file, srcFile, name, props, IO) {
        var directiveDeps = {
            name: name,
            id: 'directive-' + name + '-' + Date.now(),
            file: file,
            type: 'directive',
            description: IO.description,
            sourceCode: srcFile.getText(),
            selector: this.helper.getComponentSelector(props),
            providers: this.helper.getComponentProviders(props),
            inputsClass: IO.inputs,
            outputsClass: IO.outputs,
            hostBindings: IO.hostBindings,
            hostListeners: IO.hostListeners,
            propertiesClass: IO.properties,
            methodsClass: IO.methods,
            exampleUrls: this.helper.getComponentExampleUrls(srcFile.getText())
        };
        if (this.configuration.mainData.disableLifeCycleHooks) {
            directiveDeps.methodsClass = utils_1.cleanLifecycleHooksFromMethods(directiveDeps.methodsClass);
        }
        if (IO.jsdoctags && IO.jsdoctags.length > 0) {
            directiveDeps.jsdoctags = IO.jsdoctags[0].tags;
        }
        if (IO.implements && IO.implements.length > 0) {
            directiveDeps.implements = IO.implements;
        }
        if (IO.constructor) {
            directiveDeps.constructorObj = IO.constructor;
        }
        if (IO.accessors) {
            directiveDeps.accessors = IO.accessors;
        }
        return directiveDeps;
    };
    return DirectiveDepFactory;
}());
exports.DirectiveDepFactory = DirectiveDepFactory;
//# sourceMappingURL=directive-dep.factory.js.map