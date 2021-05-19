"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var _ = require("lodash");
var ts = require("typescript");
var utilities_1 = require("../../utilities");
var logger_1 = require("../../logger");
var utils_1 = require("../../utils/utils");
var kind_to_type_1 = require("../../utils/kind-to-type");
var code_generator_1 = require("./code-generator");
var components_tree_engine_1 = require("../engines/components-tree.engine");
var directive_dep_factory_1 = require("./deps/directive-dep.factory");
var component_helper_1 = require("./deps/helpers/component-helper");
var module_dep_factory_1 = require("./deps/module-dep.factory");
var component_dep_factory_1 = require("./deps/component-dep.factory");
var module_helper_1 = require("./deps/helpers/module-helper");
var js_doc_helper_1 = require("./deps/helpers/js-doc-helper");
var symbol_helper_1 = require("./deps/helpers/symbol-helper");
var class_helper_1 = require("./deps/helpers/class-helper");
var utils_2 = require("../../utils");
var marked = require('8fold-marked');
// TypeScript reference : https://github.com/Microsoft/TypeScript/blob/master/lib/typescript.d.ts
var Dependencies = /** @class */ (function () {
    function Dependencies(files, options, configuration, routerParser) {
        this.configuration = configuration;
        this.routerParser = routerParser;
        this.cache = new component_helper_1.ComponentCache();
        this.moduleHelper = new module_helper_1.ModuleHelper(this.cache);
        this.jsDocHelper = new js_doc_helper_1.JsDocHelper();
        this.symbolHelper = new symbol_helper_1.SymbolHelper();
        this.jsdocParserUtil = new utils_2.JsdocParserUtil();
        this.importsUtil = new utils_2.ImportsUtil();
        this.files = files;
        var transpileOptions = {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
            tsconfigDirectory: options.tsconfigDirectory
        };
        this.program = ts.createProgram(this.files, transpileOptions, utilities_1.compilerHost(transpileOptions));
        this.typeChecker = this.program.getTypeChecker();
        this.classHelper = new class_helper_1.ClassHelper(this.typeChecker, this.configuration);
        this.componentHelper = new component_helper_1.ComponentHelper(this.classHelper);
    }
    Dependencies.prototype.getDependencies = function () {
        var _this = this;
        var deps = {
            modules: [],
            modulesForGraph: [],
            components: [],
            injectables: [],
            interceptors: [],
            pipes: [],
            directives: [],
            routes: [],
            classes: [],
            interfaces: [],
            miscellaneous: {
                variables: [],
                functions: [],
                typealiases: [],
                enumerations: []
            },
            routesTree: undefined
        };
        var sourceFiles = this.program.getSourceFiles() || [];
        sourceFiles.map(function (file) {
            var filePath = file.fileName;
            if (path.extname(filePath) === '.ts') {
                if (filePath.lastIndexOf('.d.ts') === -1 && filePath.lastIndexOf('spec.ts') === -1) {
                    logger_1.logger.info('parsing', filePath);
                    _this.getSourceFileDecorators(file, deps);
                }
            }
            return deps;
        });
        // End of file scanning
        // Try merging inside the same file declarated variables & modules with imports | exports | declarations | providers
        if (deps.miscellaneous.variables.length > 0) {
            deps.miscellaneous.variables.forEach(function (_variable) {
                var newVar = [];
                (function (_var, _newVar) {
                    // getType pr reconstruire....
                    if (_var.initializer) {
                        if (_var.initializer.elements) {
                            if (_var.initializer.elements.length > 0) {
                                _var.initializer.elements.forEach(function (element) {
                                    if (element.text) {
                                        newVar.push({
                                            name: element.text,
                                            type: _this.symbolHelper.getType(element.text)
                                        });
                                    }
                                });
                            }
                        }
                    }
                })(_variable, newVar);
                var onLink = function (mod) {
                    if (mod.file === _variable.file) {
                        var process_1 = function (initialArray, _var) {
                            var indexToClean = 0;
                            var found = false;
                            var findVariableInArray = function (el, index, theArray) {
                                if (el.name === _var.name) {
                                    indexToClean = index;
                                    found = true;
                                }
                            };
                            initialArray.forEach(findVariableInArray);
                            // Clean indexes to replace
                            if (found) {
                                initialArray.splice(indexToClean, 1);
                                // Add variable
                                newVar.forEach(function (newEle) {
                                    if (typeof _.find(initialArray, { 'name': newEle.name }) === 'undefined') {
                                        initialArray.push(newEle);
                                    }
                                });
                            }
                        };
                        process_1(mod.imports, _variable);
                        process_1(mod.exports, _variable);
                        process_1(mod.declarations, _variable);
                        process_1(mod.providers, _variable);
                    }
                };
                deps.modules.forEach(onLink);
                deps.modulesForGraph.forEach(onLink);
            });
        }
        // RouterParser.printModulesRoutes();
        // RouterParser.printRoutes();
        /*if (RouterParser.incompleteRoutes.length > 0) {
            if (deps['miscellaneous']['variables'].length > 0) {
                RouterParser.fixIncompleteRoutes(deps['miscellaneous']['variables']);
            }
        }*/
        // $componentsTreeEngine.createTreesForComponents();
        this.routerParser.linkModulesAndRoutes();
        this.routerParser.constructModulesTree();
        deps.routesTree = this.routerParser.constructRoutesTree();
        return deps;
    };
    Dependencies.prototype.processClass = function (node, file, srcFile, outputSymbols, fileBody) {
        var name = this.getSymboleName(node);
        var IO = this.getClassIO(file, srcFile, node, fileBody);
        var deps = {
            name: name,
            id: 'class-' + name + '-' + Date.now(),
            file: file,
            type: 'class',
            sourceCode: srcFile.getText()
        };
        if (IO.constructor) {
            deps.constructorObj = IO.constructor;
        }
        if (IO.properties) {
            deps.properties = IO.properties;
        }
        if (IO.description) {
            deps.description = IO.description;
        }
        if (IO.methods) {
            deps.methods = IO.methods;
        }
        if (IO.indexSignatures) {
            deps.indexSignatures = IO.indexSignatures;
        }
        if (IO.extends) {
            deps.extends = IO.extends;
        }
        if (IO.jsdoctags && IO.jsdoctags.length > 0) {
            deps.jsdoctags = IO.jsdoctags[0].tags;
        }
        if (IO.implements && IO.implements.length > 0) {
            deps.implements = IO.implements;
        }
        if (IO.accessors) {
            deps.accessors = IO.accessors;
        }
        this.debug(deps);
        outputSymbols.classes.push(deps);
    };
    Dependencies.prototype.getSourceFileDecorators = function (srcFile, outputSymbols) {
        var _this = this;
        var cleaner = (process.cwd() + path.sep).replace(/\\/g, '/');
        var file = srcFile.fileName.replace(cleaner, '');
        ts.forEachChild(srcFile, function (node) {
            if (_this.jsDocHelper.hasJSDocInternalTag(file, srcFile, node) && _this.configuration.mainData.disableInternal) {
                return;
            }
            var parseNode = function (file, srcFile, node, fileBody) {
                if (node.decorators) {
                    var classWithCustomDecorator_1 = false;
                    var visitNode = function (visitedNode, index) {
                        var deps;
                        var metadata = node.decorators;
                        var name = _this.getSymboleName(node);
                        var props = _this.findProperties(visitedNode, srcFile);
                        var IO = _this.componentHelper.getComponentIO(file, srcFile, node, fileBody);
                        if (_this.isModule(metadata)) {
                            var moduleDep = new module_dep_factory_1.ModuleDepFactory(_this.moduleHelper)
                                .create(file, srcFile, name, props, IO);
                            if (_this.routerParser.hasRouterModuleInImports(moduleDep.imports)) {
                                _this.routerParser.addModuleWithRoutes(name, _this.moduleHelper.getModuleImportsRaw(props), file);
                            }
                            _this.routerParser.addModule(name, moduleDep.imports);
                            outputSymbols.modules.push(moduleDep);
                            outputSymbols.modulesForGraph.push(moduleDep);
                            deps = moduleDep;
                        }
                        else if (_this.isComponent(metadata)) {
                            if (props.length === 0) {
                                return;
                            }
                            var componentDep = new component_dep_factory_1.ComponentDepFactory(_this.componentHelper, _this.configuration)
                                .create(file, srcFile, name, props, IO);
                            components_tree_engine_1.$componentsTreeEngine.addComponent(componentDep);
                            outputSymbols.components.push(componentDep);
                            deps = componentDep;
                        }
                        else if (_this.isInjectable(metadata)) {
                            var injectableDeps = {
                                name: name,
                                id: 'injectable-' + name + '-' + Date.now(),
                                file: file,
                                type: 'injectable',
                                properties: IO.properties,
                                methods: IO.methods,
                                description: IO.description,
                                sourceCode: srcFile.getText()
                            };
                            if (IO.constructor) {
                                injectableDeps.constructorObj = IO.constructor;
                            }
                            if (IO.jsdoctags && IO.jsdoctags.length > 0) {
                                injectableDeps.jsdoctags = IO.jsdoctags[0].tags;
                            }
                            if (IO.accessors) {
                                injectableDeps.accessors = IO.accessors;
                            }
                            if (IO.implements && IO.implements.length > 0) {
                                if (_.indexOf(IO.implements, 'HttpInterceptor') >= 0) {
                                    outputSymbols.interceptors.push(injectableDeps);
                                }
                                else {
                                    outputSymbols.injectables.push(injectableDeps);
                                }
                            }
                            else {
                                outputSymbols.injectables.push(injectableDeps);
                            }
                            deps = injectableDeps;
                        }
                        else if (_this.isPipe(metadata)) {
                            var pipeDeps = {
                                name: name,
                                id: 'pipe-' + name + '-' + Date.now(),
                                file: file,
                                type: 'pipe',
                                description: IO.description,
                                properties: IO.properties,
                                methods: IO.methods,
                                pure: _this.componentHelper.getComponentPure(props),
                                ngname: _this.componentHelper.getComponentName(props),
                                sourceCode: srcFile.getText(),
                                exampleUrls: _this.componentHelper.getComponentExampleUrls(srcFile.getText())
                            };
                            if (IO.jsdoctags && IO.jsdoctags.length > 0) {
                                pipeDeps.jsdoctags = IO.jsdoctags[0].tags;
                            }
                            outputSymbols.pipes.push(pipeDeps);
                            deps = pipeDeps;
                        }
                        else if (_this.isDirective(metadata)) {
                            if (props.length === 0) {
                                return;
                            }
                            var directiveDeps = new directive_dep_factory_1.DirectiveDepFactory(_this.componentHelper, _this.configuration)
                                .create(file, srcFile, name, props, IO);
                            outputSymbols.directives.push(directiveDeps);
                            deps = directiveDeps;
                        }
                        else {
                            // Just a class
                            if (!classWithCustomDecorator_1) {
                                classWithCustomDecorator_1 = true;
                                _this.processClass(node, file, srcFile, outputSymbols, fileBody);
                            }
                        }
                        _this.cache.set(name, deps);
                        _this.debug(deps);
                    };
                    var filterByDecorators = function (filteredNode) {
                        if (filteredNode.expression && filteredNode.expression.expression) {
                            var _test = /(NgModule|Component|Injectable|Pipe|Directive)/.test(filteredNode.expression.expression.text);
                            if (!_test && ts.isClassDeclaration(node)) {
                                _test = true;
                            }
                            return _test;
                        }
                        if (ts.isClassDeclaration(node)) {
                            return true;
                        }
                        return false;
                    };
                    node.decorators
                        .filter(filterByDecorators)
                        .forEach(visitNode);
                }
                else if (node.symbol) {
                    if (node.symbol.flags === ts.SymbolFlags.Class) {
                        _this.processClass(node, file, srcFile, outputSymbols, fileBody);
                    }
                    else if (node.symbol.flags === ts.SymbolFlags.Interface) {
                        var name = _this.getSymboleName(node);
                        var IO = _this.getInterfaceIO(file, srcFile, node, fileBody);
                        var interfaceDeps = {
                            name: name,
                            id: 'interface-' + name + '-' + Date.now(),
                            file: file,
                            type: 'interface',
                            sourceCode: srcFile.getText()
                        };
                        if (IO.properties) {
                            interfaceDeps.properties = IO.properties;
                        }
                        if (IO.indexSignatures) {
                            interfaceDeps.indexSignatures = IO.indexSignatures;
                        }
                        if (IO.kind) {
                            interfaceDeps.kind = IO.kind;
                        }
                        if (IO.description) {
                            interfaceDeps.description = IO.description;
                        }
                        if (IO.methods) {
                            interfaceDeps.methods = IO.methods;
                        }
                        if (IO.extends) {
                            interfaceDeps.extends = IO.extends;
                        }
                        _this.debug(interfaceDeps);
                        outputSymbols.interfaces.push(interfaceDeps);
                    }
                    else if (ts.isFunctionDeclaration(node)) {
                        var infos = _this.visitFunctionDeclaration(node);
                        var tags = _this.visitFunctionDeclarationJSDocTags(node);
                        var name = infos.name;
                        var functionDep = {
                            name: name,
                            file: file,
                            type: 'miscellaneous',
                            subtype: 'function',
                            description: _this.visitEnumTypeAliasFunctionDeclarationDescription(node)
                        };
                        if (infos.args) {
                            functionDep.args = infos.args;
                        }
                        if (tags && tags.length > 0) {
                            functionDep.jsdoctags = tags;
                        }
                        outputSymbols.miscellaneous.functions.push(functionDep);
                    }
                    else if (ts.isEnumDeclaration(node)) {
                        var infos = _this.visitEnumDeclaration(node);
                        var name = node.name.text;
                        var enumDeps = {
                            name: name,
                            childs: infos,
                            type: 'miscellaneous',
                            subtype: 'enum',
                            description: _this.visitEnumTypeAliasFunctionDeclarationDescription(node),
                            file: file
                        };
                        outputSymbols.miscellaneous.enumerations.push(enumDeps);
                    }
                    else if (ts.isTypeAliasDeclaration(node)) {
                        var infos = _this.visitTypeDeclaration(node);
                        var name = infos.name;
                        var typeAliasDeps = {
                            name: name,
                            type: 'miscellaneous',
                            subtype: 'typealias',
                            rawtype: _this.classHelper.visitType(node),
                            file: file,
                            description: _this.visitEnumTypeAliasFunctionDeclarationDescription(node)
                        };
                        if (node.type) {
                            typeAliasDeps.kind = node.type.kind;
                            if (typeAliasDeps.rawtype === '') {
                                typeAliasDeps.rawtype = kind_to_type_1.kindToType(node.type.kind);
                            }
                        }
                        outputSymbols.miscellaneous.typealiases.push(typeAliasDeps);
                    }
                    else if (ts.isModuleDeclaration(node)) {
                        if (node.body) {
                            if (node.body.statements && node.body.statements.length > 0) {
                                node.body.statements
                                    .forEach(function (statement) { return parseNode(file, srcFile, statement, node.body); });
                            }
                        }
                    }
                }
                else {
                    var IO = _this.getRouteIO(file, srcFile);
                    if (IO.routes) {
                        var newRoutes = void 0;
                        try {
                            newRoutes = _this.routerParser.cleanRawRouteParsed(IO.routes);
                        }
                        catch (e) {
                            // tslint:disable-next-line:max-line-length
                            logger_1.logger.error('Routes parsing error, maybe a trailing comma or an external variable, trying to fix that later after sources scanning.');
                            newRoutes = IO.routes.replace(/ /gm, '');
                            _this.routerParser.addIncompleteRoute({
                                data: newRoutes,
                                file: file
                            });
                            return true;
                        }
                        outputSymbols.routes = outputSymbols.routes.concat(newRoutes);
                    }
                    if (ts.isClassDeclaration(node)) {
                        _this.processClass(node, file, srcFile, outputSymbols, fileBody);
                    }
                    if (ts.isExpressionStatement(node)) {
                        var bootstrapModuleReference = 'bootstrapModule';
                        // Find the root module with bootstrapModule call
                        // 1. find a simple call : platformBrowserDynamic().bootstrapModule(AppModule);
                        // 2. or inside a call :
                        // () => {
                        //     platformBrowserDynamic().bootstrapModule(AppModule);
                        // });
                        // 3. with a catch : platformBrowserDynamic().bootstrapModule(AppModule).catch(error => console.error(error));
                        // 4. with parameters : platformBrowserDynamic().bootstrapModule(AppModule, {}).catch(error => console.error(error));
                        // Find recusively in expression nodes one with name 'bootstrapModule'
                        var rootModule_1;
                        var resultNode = void 0;
                        if (srcFile.text.indexOf(bootstrapModuleReference) !== -1) {
                            if (node.expression) {
                                resultNode = _this.findExpressionByNameInExpressions(node.expression, 'bootstrapModule');
                            }
                            if (!resultNode) {
                                if (node.expression && node.expression.arguments && node.expression.arguments.length > 0) {
                                    resultNode = _this.findExpressionByNameInExpressionArguments(node.expression.arguments, 'bootstrapModule');
                                }
                            }
                            if (resultNode) {
                                if (resultNode.arguments.length > 0) {
                                    _.forEach(resultNode.arguments, function (argument) {
                                        if (argument.text) {
                                            rootModule_1 = argument.text;
                                        }
                                    });
                                }
                                if (rootModule_1) {
                                    _this.routerParser.setRootModule(rootModule_1);
                                }
                            }
                        }
                    }
                    if (ts.isVariableStatement(node) && !_this.isVariableRoutes(node)) {
                        var infos = _this.visitVariableDeclaration(node);
                        var name = infos.name;
                        var deps = {
                            name: name,
                            type: 'miscellaneous',
                            subtype: 'variable',
                            file: file
                        };
                        deps.type = (infos.type) ? infos.type : '';
                        if (infos.defaultValue) {
                            deps.defaultValue = infos.defaultValue;
                        }
                        if (infos.initializer) {
                            deps.initializer = infos.initializer;
                        }
                        if (node.jsDoc && node.jsDoc.length > 0 && node.jsDoc[0].comment) {
                            deps.description = marked(node.jsDoc[0].comment);
                        }
                        outputSymbols.miscellaneous.variables.push(deps);
                    }
                    if (ts.isTypeAliasDeclaration(node)) {
                        var infos = _this.visitTypeDeclaration(node);
                        var name = infos.name;
                        var deps = {
                            name: name,
                            type: 'miscellaneous',
                            subtype: 'typealias',
                            rawtype: _this.classHelper.visitType(node),
                            file: file,
                            description: _this.visitEnumTypeAliasFunctionDeclarationDescription(node)
                        };
                        if (node.type) {
                            deps.kind = node.type.kind;
                        }
                        outputSymbols.miscellaneous.typealiases.push(deps);
                    }
                    if (ts.isFunctionDeclaration(node)) {
                        var infos = _this.visitFunctionDeclaration(node);
                        var name = infos.name;
                        var deps = {
                            name: name,
                            type: 'miscellaneous',
                            subtype: 'function',
                            file: file,
                            description: _this.visitEnumTypeAliasFunctionDeclarationDescription(node)
                        };
                        if (infos.args) {
                            deps.args = infos.args;
                        }
                        outputSymbols.miscellaneous.functions.push(deps);
                    }
                    if (ts.isEnumDeclaration(node)) {
                        var infos = _this.visitEnumDeclaration(node);
                        var name = node.name.text;
                        var deps = {
                            name: name,
                            childs: infos,
                            type: 'miscellaneous',
                            subtype: 'enum',
                            description: _this.visitEnumTypeAliasFunctionDeclarationDescription(node),
                            file: file
                        };
                        outputSymbols.miscellaneous.enumerations.push(deps);
                    }
                }
            };
            parseNode(file, srcFile, node);
        });
    };
    Dependencies.prototype.debug = function (deps) {
        if (deps) {
            logger_1.logger.debug('found', "" + deps.name);
        }
        else {
            return;
        }
        [
            'imports', 'exports', 'declarations', 'providers', 'bootstrap'
        ].forEach(function (symbols) {
            if (deps[symbols] && deps[symbols].length > 0) {
                logger_1.logger.debug('', "- " + symbols + ":");
                deps[symbols].map(function (i) { return i.name; }).forEach(function (d) {
                    logger_1.logger.debug('', "\t- " + d);
                });
            }
        });
    };
    Dependencies.prototype.isVariableRoutes = function (node) {
        var result = false;
        if (node.declarationList.declarations) {
            var i = 0;
            var len = node.declarationList.declarations.length;
            for (i; i < len; i++) {
                if (node.declarationList.declarations[i].type) {
                    if (node.declarationList.declarations[i].type.typeName &&
                        node.declarationList.declarations[i].type.typeName.text === 'Routes') {
                        result = true;
                    }
                }
            }
        }
        return result;
    };
    Dependencies.prototype.findExpressionByNameInExpressions = function (entryNode, name) {
        var result;
        var loop = function (node, z) {
            if (node.expression && !node.expression.name) {
                loop(node.expression, z);
            }
            if (node.expression && node.expression.name) {
                if (node.expression.name.text === z) {
                    result = node;
                }
                else {
                    loop(node.expression, z);
                }
            }
        };
        loop(entryNode, name);
        return result;
    };
    Dependencies.prototype.findExpressionByNameInExpressionArguments = function (arg, name) {
        var result;
        var that = this;
        var i = 0;
        var len = arg.length;
        var loop = function (node, z) {
            if (node.body) {
                if (node.body.statements && node.body.statements.length > 0) {
                    var j = 0;
                    var leng = node.body.statements.length;
                    for (j; j < leng; j++) {
                        result = that.findExpressionByNameInExpressions(node.body.statements[j], z);
                    }
                }
            }
        };
        for (i; i < len; i++) {
            loop(arg[i], name);
        }
        return result;
    };
    Dependencies.prototype.parseDecorators = function (decorators, type) {
        var result = false;
        if (decorators.length > 1) {
            _.forEach(decorators, function (decorator) {
                if (decorator.expression.expression) {
                    if (decorator.expression.expression.text === type) {
                        result = true;
                    }
                }
            });
        }
        else {
            if (decorators[0].expression.expression) {
                if (decorators[0].expression.expression.text === type) {
                    result = true;
                }
            }
        }
        return result;
    };
    Dependencies.prototype.isComponent = function (metadatas) {
        return this.parseDecorators(metadatas, 'Component');
    };
    Dependencies.prototype.isPipe = function (metadatas) {
        return this.parseDecorators(metadatas, 'Pipe');
    };
    Dependencies.prototype.isDirective = function (metadatas) {
        return this.parseDecorators(metadatas, 'Directive');
    };
    Dependencies.prototype.isInjectable = function (metadatas) {
        return this.parseDecorators(metadatas, 'Injectable');
    };
    Dependencies.prototype.isModule = function (metadatas) {
        return this.parseDecorators(metadatas, 'NgModule');
    };
    Dependencies.prototype.getSymboleName = function (node) {
        return node.name.text;
    };
    Dependencies.prototype.findProperties = function (visitedNode, sourceFile) {
        if (ts.isCallExpression(visitedNode.expression) && visitedNode.expression.arguments.length > 0) {
            var pop = visitedNode.expression.arguments[0];
            if (ts.isObjectLiteralExpression(pop)) {
                return pop.properties;
            }
            else {
                logger_1.logger.warn('Empty metadatas, trying to found it with imports.');
                return this.importsUtil.merge(pop.text, sourceFile);
            }
        }
        return [];
    };
    Dependencies.prototype.isAngularLifecycleHook = function (methodName) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var ANGULAR_LIFECYCLE_METHODS = [
            'ngOnInit', 'ngOnChanges', 'ngDoCheck', 'ngOnDestroy', 'ngAfterContentInit', 'ngAfterContentChecked',
            'ngAfterViewInit', 'ngAfterViewChecked', 'writeValue', 'registerOnChange', 'registerOnTouched', 'setDisabledState'
        ];
        return ANGULAR_LIFECYCLE_METHODS.indexOf(methodName) >= 0;
    };
    Dependencies.prototype.visitTypeDeclaration = function (node) {
        var result = {
            name: node.name.text,
            kind: node.kind
        };
        var jsdoctags = this.jsdocParserUtil.getJSDocs(node);
        if (jsdoctags && jsdoctags.length >= 1) {
            if (jsdoctags[0].tags) {
                result.jsdoctags = utils_1.markedtags(jsdoctags[0].tags);
            }
        }
        return result;
    };
    Dependencies.prototype.visitArgument = function (arg) {
        var result = {
            name: arg.name.text
        };
        if (arg.type) {
            result.type = this.mapType(arg.type.kind);
            if (arg.type.kind === 157) {
                // try replace TypeReference with typeName
                if (arg.type.typeName) {
                    result.type = arg.type.typeName.text;
                }
            }
        }
        return result;
    };
    Dependencies.prototype.mapType = function (type) {
        switch (type) {
            case 94:
                return 'Null';
            case 118:
                return 'Any';
            case 121:
                return 'Boolean';
            case 129:
                return 'Never';
            case 132:
                return 'Number';
            case 134:
                return 'String';
            case 137:
                return 'Undefined';
            case 157:
                return 'TypeReference';
        }
    };
    Dependencies.prototype.visitFunctionDeclaration = function (method) {
        var _this = this;
        var result = {
            name: method.name.text,
            args: method.parameters ? method.parameters.map(function (prop) { return _this.visitArgument(prop); }) : []
        };
        var jsdoctags = this.jsdocParserUtil.getJSDocs(method);
        if (typeof method.type !== 'undefined') {
            result.returnType = this.classHelper.visitType(method.type);
        }
        if (method.modifiers) {
            if (method.modifiers.length > 0) {
                result.modifierKind = method.modifiers[0].kind;
            }
        }
        if (jsdoctags && jsdoctags.length >= 1) {
            if (jsdoctags[0].tags) {
                result.jsdoctags = utils_1.markedtags(jsdoctags[0].tags);
            }
        }
        return result;
    };
    Dependencies.prototype.visitVariableDeclaration = function (node) {
        if (node.declarationList.declarations) {
            var i = 0;
            var len = node.declarationList.declarations.length;
            for (i; i < len; i++) {
                var result = {
                    name: node.declarationList.declarations[i].name.text,
                    defaultValue: node.declarationList.declarations[i].initializer ?
                        this.classHelper.stringifyDefaultValue(node.declarationList.declarations[i].initializer) : undefined
                };
                if (node.declarationList.declarations[i].initializer) {
                    result.initializer = node.declarationList.declarations[i].initializer;
                }
                if (node.declarationList.declarations[i].type) {
                    result.type = this.classHelper.visitType(node.declarationList.declarations[i].type);
                }
                if (typeof result.type === 'undefined' && result.initializer) {
                    result.type = kind_to_type_1.kindToType(result.initializer.kind);
                }
                return result;
            }
        }
    };
    Dependencies.prototype.visitFunctionDeclarationJSDocTags = function (node) {
        var jsdoctags = this.jsdocParserUtil.getJSDocs(node);
        var result;
        if (jsdoctags && jsdoctags.length >= 1) {
            if (jsdoctags[0].tags) {
                result = utils_1.markedtags(jsdoctags[0].tags);
            }
        }
        return result;
    };
    Dependencies.prototype.visitEnumTypeAliasFunctionDeclarationDescription = function (node) {
        var description = '';
        if (node.jsDoc) {
            if (node.jsDoc.length > 0) {
                if (typeof node.jsDoc[0].comment !== 'undefined') {
                    description = marked(node.jsDoc[0].comment);
                }
            }
        }
        return description;
    };
    Dependencies.prototype.visitEnumDeclaration = function (node) {
        var result = [];
        if (node.members) {
            var i = 0;
            var len = node.members.length;
            for (i; i < len; i++) {
                var member = {
                    name: node.members[i].name.text
                };
                if (node.members[i].initializer) {
                    member.value = node.members[i].initializer.text;
                }
                result.push(member);
            }
        }
        return result;
    };
    Dependencies.prototype.visitEnumDeclarationForRoutes = function (fileName, node) {
        if (node.declarationList.declarations) {
            var i = 0;
            var len = node.declarationList.declarations.length;
            for (i; i < len; i++) {
                if (node.declarationList.declarations[i].type) {
                    if (node.declarationList.declarations[i].type.typeName &&
                        node.declarationList.declarations[i].type.typeName.text === 'Routes') {
                        var data = new code_generator_1.CodeGenerator().generate(node.declarationList.declarations[i].initializer);
                        this.routerParser.addRoute({
                            name: node.declarationList.declarations[i].name.text,
                            data: this.routerParser.cleanRawRoute(data),
                            filename: fileName
                        });
                        return [{
                                routes: data
                            }];
                    }
                }
            }
        }
        return [];
    };
    Dependencies.prototype.getRouteIO = function (filename, sourceFile) {
        var _this = this;
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var res;
        if (sourceFile.statements) {
            res = sourceFile.statements.reduce(function (directive, statement) {
                if (ts.isVariableStatement(statement)) {
                    return directive.concat(_this.visitEnumDeclarationForRoutes(filename, statement));
                }
                return directive;
            }, []);
            return res[0] || {};
        }
        else {
            return {};
        }
    };
    Dependencies.prototype.getClassIO = function (filename, sourceFile, node, fileBody) {
        var _this = this;
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var reducedSource = (fileBody) ? fileBody.statements : sourceFile.statements;
        var res = reducedSource.reduce(function (directive, statement) {
            if (ts.isClassDeclaration(statement)) {
                if (statement.pos === node.pos && statement.end === node.end) {
                    return directive.concat(_this.classHelper.visitClassDeclaration(filename, statement, sourceFile));
                }
            }
            return directive;
        }, []);
        return res[0] || {};
    };
    Dependencies.prototype.getInterfaceIO = function (filename, sourceFile, node, fileBody) {
        var _this = this;
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var reducedSource = (fileBody) ? fileBody.statements : sourceFile.statements;
        var res = reducedSource.reduce(function (directive, statement) {
            if (ts.isInterfaceDeclaration(statement)) {
                if (statement.pos === node.pos && statement.end === node.end) {
                    return directive.concat(_this.classHelper.visitClassDeclaration(filename, statement, sourceFile));
                }
            }
            return directive;
        }, []);
        return res[0] || {};
    };
    return Dependencies;
}());
exports.Dependencies = Dependencies;
//# sourceMappingURL=dependencies.js.map