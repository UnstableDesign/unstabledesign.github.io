"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var Handlebars = require("handlebars");
var _ = require("lodash");
var JSON5 = require("json5");
var file_engine_1 = require("../app/engines/file.engine");
var RouterParserUtil = /** @class */ (function () {
    function RouterParserUtil() {
        this.routes = [];
        this.incompleteRoutes = [];
        this.modules = [];
        this.modulesWithRoutes = [];
        this.fileEngine = new file_engine_1.FileEngine();
    }
    RouterParserUtil.prototype.addRoute = function (route) {
        this.routes.push(route);
        this.routes = _.sortBy(_.uniqWith(this.routes, _.isEqual), ['name']);
    };
    RouterParserUtil.prototype.addIncompleteRoute = function (route) {
        this.incompleteRoutes.push(route);
        this.incompleteRoutes = _.sortBy(_.uniqWith(this.incompleteRoutes, _.isEqual), ['name']);
    };
    RouterParserUtil.prototype.addModuleWithRoutes = function (moduleName, moduleImports, filename) {
        this.modulesWithRoutes.push({
            name: moduleName,
            importsNode: moduleImports,
            filename: filename
        });
        this.modulesWithRoutes = _.sortBy(_.uniqWith(this.modulesWithRoutes, _.isEqual), ['name']);
    };
    RouterParserUtil.prototype.addModule = function (moduleName, moduleImports) {
        this.modules.push({
            name: moduleName,
            importsNode: moduleImports
        });
        this.modules = _.sortBy(_.uniqWith(this.modules, _.isEqual), ['name']);
    };
    RouterParserUtil.prototype.cleanRawRouteParsed = function (route) {
        var routesWithoutSpaces = route.replace(/ /gm, '');
        var testTrailingComma = routesWithoutSpaces.indexOf('},]');
        if (testTrailingComma !== -1) {
            routesWithoutSpaces = routesWithoutSpaces.replace('},]', '}]');
        }
        return JSON5.parse(routesWithoutSpaces);
    };
    RouterParserUtil.prototype.cleanRawRoute = function (route) {
        var routesWithoutSpaces = route.replace(/ /gm, '');
        var testTrailingComma = routesWithoutSpaces.indexOf('},]');
        if (testTrailingComma !== -1) {
            routesWithoutSpaces = routesWithoutSpaces.replace('},]', '}]');
        }
        return routesWithoutSpaces;
    };
    RouterParserUtil.prototype.setRootModule = function (module) {
        this.rootModule = module;
    };
    RouterParserUtil.prototype.hasRouterModuleInImports = function (imports) {
        for (var i = 0; i < imports.length; i++) {
            if (imports[i].name.indexOf('RouterModule.forChild') !== -1 ||
                imports[i].name.indexOf('RouterModule.forRoot') !== -1) {
                return true;
            }
        }
        return false;
    };
    RouterParserUtil.prototype.fixIncompleteRoutes = function (miscellaneousVariables) {
        /*console.log('fixIncompleteRoutes');
        console.log('');
        console.log(routes);
        console.log('');*/
        // console.log(miscellaneousVariables);
        // console.log('');
        var matchingVariables = [];
        // For each incompleteRoute, scan if one misc variable is in code
        // if ok, try recreating complete route
        for (var i = 0; i < this.incompleteRoutes.length; i++) {
            for (var j = 0; j < miscellaneousVariables.length; j++) {
                if (this.incompleteRoutes[i].data.indexOf(miscellaneousVariables[j].name) !== -1) {
                    console.log('found one misc var inside incompleteRoute');
                    console.log(miscellaneousVariables[j].name);
                    matchingVariables.push(miscellaneousVariables[j]);
                }
            }
            // Clean incompleteRoute
            this.incompleteRoutes[i].data = this.incompleteRoutes[i].data.replace('[', '');
            this.incompleteRoutes[i].data = this.incompleteRoutes[i].data.replace(']', '');
        }
        /*console.log(incompleteRoutes);
        console.log('');
        console.log(matchingVariables);
        console.log('');*/
    };
    RouterParserUtil.prototype.linkModulesAndRoutes = function () {
        var _this = this;
        /*console.log('');
        console.log('linkModulesAndRoutes: ');
        //scan each module imports AST for each routes, and link routes with module
        console.log('linkModulesAndRoutes routes: ', routes);
        console.log('');*/
        var i = 0;
        var len = this.modulesWithRoutes.length;
        for (i; i < len; i++) {
            _.forEach(this.modulesWithRoutes[i].importsNode, function (node) {
                var initializer = node.initializer;
                if (initializer) {
                    if (initializer.elements) {
                        _.forEach(initializer.elements, function (element) {
                            // find element with arguments
                            if (element.arguments) {
                                _.forEach(element.arguments, function (argument) {
                                    _.forEach(_this.routes, function (route) {
                                        if (argument.text && route.name === argument.text &&
                                            route.filename === _this.modulesWithRoutes[i].filename) {
                                            route.module = _this.modulesWithRoutes[i].name;
                                        }
                                    });
                                });
                            }
                        });
                    }
                }
            });
        }
    };
    RouterParserUtil.prototype.foundRouteWithModuleName = function (moduleName) {
        return _.find(this.routes, { 'module': moduleName });
    };
    RouterParserUtil.prototype.foundLazyModuleWithPath = function (modulePath) {
        // path is like app/customers/customers.module#CustomersModule
        var split = modulePath.split('#');
        var lazyModulePath = split[0];
        var lazyModuleName = split[1];
        return lazyModuleName;
    };
    RouterParserUtil.prototype.constructRoutesTree = function () {
        // console.log('');
        /*console.log('constructRoutesTree modules: ', modules);
        console.log('');
        console.log('constructRoutesTree modulesWithRoutes: ', modulesWithRoutes);
        console.log('');
        console.log('constructRoutesTree modulesTree: ', util.inspect(modulesTree, { depth: 10 }));
        console.log('');*/
        var _this = this;
        // routes[] contains routes with module link
        // modulesTree contains modules tree
        // make a final routes tree with that
        this.cleanModulesTree = _.cloneDeep(this.modulesTree);
        var modulesCleaner = function (arr) {
            for (var i in arr) {
                if (arr[i].importsNode) {
                    delete arr[i].importsNode;
                }
                if (arr[i].parent) {
                    delete arr[i].parent;
                }
                if (arr[i].children) {
                    modulesCleaner(arr[i].children);
                }
            }
        };
        modulesCleaner(this.cleanModulesTree);
        // console.log('');
        // console.log('  cleanModulesTree light: ', util.inspect(cleanModulesTree, { depth: 10 }));
        // console.log('');
        // console.log(routes);
        // console.log('');
        var routesTree = {
            name: '<root>',
            kind: 'module',
            className: this.rootModule,
            children: []
        };
        var loopModulesParser = function (node) {
            if (node.children && node.children.length > 0) {
                // If module has child modules
                // console.log('   If module has child modules');
                for (var i in node.children) {
                    var route = _this.foundRouteWithModuleName(node.children[i].name);
                    if (route && route.data) {
                        route.children = JSON5.parse(route.data);
                        delete route.data;
                        route.kind = 'module';
                        routesTree.children.push(route);
                    }
                    if (node.children[i].children) {
                        loopModulesParser(node.children[i]);
                    }
                }
            }
            else {
                // else routes are directly inside the module
                // console.log('   else routes are directly inside the root module');
                var rawRoutes = _this.foundRouteWithModuleName(node.name);
                if (rawRoutes) {
                    var routes = JSON5.parse(rawRoutes.data);
                    if (routes) {
                        var i = 0;
                        var len = routes.length;
                        for (i; i < len; i++) {
                            var route = routes[i];
                            if (routes[i].component) {
                                routesTree.children.push({
                                    kind: 'component',
                                    component: routes[i].component,
                                    path: routes[i].path
                                });
                            }
                        }
                    }
                }
            }
        };
        // console.log('');
        // console.log('  rootModule: ', rootModule);
        // console.log('');
        var startModule = _.find(this.cleanModulesTree, { 'name': this.rootModule });
        if (startModule) {
            loopModulesParser(startModule);
            // Loop twice for routes with lazy loading
            // loopModulesParser(routesTree);
        }
        /*console.log('');
        console.log('  routesTree: ', routesTree);
        console.log('');*/
        var cleanedRoutesTree = undefined;
        var cleanRoutesTree = function (route) {
            for (var i in route.children) {
                var routes = route.children[i].routes;
            }
            return route;
        };
        cleanedRoutesTree = cleanRoutesTree(routesTree);
        // Try updating routes with lazy loading
        // console.log('');
        // console.log('Try updating routes with lazy loading');
        var loopInside = function (mod, _rawModule) {
            if (mod.children) {
                for (var z in mod.children) {
                    var route = _this.foundRouteWithModuleName(mod.children[z].name);
                    if (typeof route !== 'undefined') {
                        if (route.data) {
                            route.children = JSON5.parse(route.data);
                            delete route.data;
                            route.kind = 'module';
                            _rawModule.children.push(route);
                        }
                    }
                }
            }
        };
        var loopRoutesParser = function (route) {
            if (route.children) {
                for (var i in route.children) {
                    if (route.children[i].loadChildren) {
                        var child = _this.foundLazyModuleWithPath(route.children[i].loadChildren);
                        var module_1 = _.find(_this.cleanModulesTree, { 'name': child });
                        if (module_1) {
                            var _rawModule = {};
                            _rawModule.kind = 'module';
                            _rawModule.children = [];
                            _rawModule.module = module_1.name;
                            loopInside(module_1, _rawModule);
                            route.children[i].children = [];
                            route.children[i].children.push(_rawModule);
                        }
                    }
                    loopRoutesParser(route.children[i]);
                }
            }
        };
        loopRoutesParser(cleanedRoutesTree);
        // console.log('');
        // console.log('  cleanedRoutesTree: ', util.inspect(cleanedRoutesTree, { depth: 10 }));
        return cleanedRoutesTree;
    };
    RouterParserUtil.prototype.constructModulesTree = function () {
        var _this = this;
        // console.log('');
        // console.log('constructModulesTree');
        var getNestedChildren = function (arr, parent) {
            var out = [];
            for (var i in arr) {
                if (arr[i].parent === parent) {
                    var children = getNestedChildren(arr, arr[i].name);
                    if (children.length) {
                        arr[i].children = children;
                    }
                    out.push(arr[i]);
                }
            }
            return out;
        };
        // Scan each module and add parent property
        _.forEach(this.modules, function (firstLoopModule) {
            _.forEach(firstLoopModule.importsNode, function (importNode) {
                _.forEach(_this.modules, function (module) {
                    if (module.name === importNode.name) {
                        module.parent = firstLoopModule.name;
                    }
                });
            });
        });
        this.modulesTree = getNestedChildren(this.modules);
        /*console.log('');
        console.log('end constructModulesTree');
        console.log(modulesTree);*/
    };
    RouterParserUtil.prototype.generateRoutesIndex = function (outputFolder, routes) {
        var _this = this;
        return this.fileEngine.get(__dirname + '/../src/templates/partials/routes-index.hbs').then(function (data) {
            var template = Handlebars.compile(data);
            var result = template({
                routes: JSON.stringify(routes)
            });
            var testOutputDir = outputFolder.match(process.cwd());
            if (!testOutputDir) {
                outputFolder = outputFolder.replace(process.cwd(), '');
            }
            return _this.fileEngine.write(outputFolder + path.sep + '/js/routes/routes_index.js', result);
        }, function (err) { return Promise.reject('Error during routes index generation'); });
    };
    RouterParserUtil.prototype.routesLength = function () {
        var _n = 0;
        var routesParser = function (route) {
            if (typeof route.path !== 'undefined') {
                _n += 1;
            }
            if (route.children) {
                for (var j in route.children) {
                    routesParser(route.children[j]);
                }
            }
        };
        for (var i in this.routes) {
            routesParser(this.routes[i]);
        }
        return _n;
    };
    RouterParserUtil.prototype.printRoutes = function () {
        console.log('');
        console.log('printRoutes: ');
        console.log(this.routes);
    };
    RouterParserUtil.prototype.printModulesRoutes = function () {
        console.log('');
        console.log('printModulesRoutes: ');
        console.log(this.modulesWithRoutes);
    };
    return RouterParserUtil;
}());
exports.RouterParserUtil = RouterParserUtil;
//# sourceMappingURL=router-parser.util.js.map