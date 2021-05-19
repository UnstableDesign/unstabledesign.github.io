"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
var LiveServer = require("live-server");
var _ = require("lodash");
var ts = require("typescript");
var chokidar = require('chokidar');
var marked = require('8fold-marked');
var logger_1 = require("../logger");
var html_engine_1 = require("./engines/html.engine");
var markdown_engine_1 = require("./engines/markdown.engine");
var file_engine_1 = require("./engines/file.engine");
var configuration_1 = require("./configuration");
var ngd_engine_1 = require("./engines/ngd.engine");
var search_engine_1 = require("./engines/search.engine");
var export_engine_1 = require("./engines/export.engine");
var dependencies_1 = require("./compiler/dependencies");
var defaults_1 = require("../utils/defaults");
var utils_1 = require("../utils/utils");
var utilities_1 = require("../utilities");
var promise_sequential_1 = require("../utils/promise-sequential");
var dependencies_engine_1 = require("./engines/dependencies.engine");
var utils_2 = require("../utils");
var pkg = require('../package.json');
var cwd = process.cwd();
var $markdownengine = new markdown_engine_1.MarkdownEngine();
var startTime = new Date();
var generationPromiseResolve;
var generationPromiseReject;
var generationPromise = new Promise(function (resolve, reject) {
    generationPromiseResolve = resolve;
    generationPromiseReject = reject;
});
var Application = /** @class */ (function () {
    /**
     * Create a new compodoc application instance.
     *
     * @param options An object containing the options that should be used.
     */
    function Application(options) {
        var _this = this;
        /**
         * Files changed during watch scanning
         */
        this.watchChangedFiles = [];
        /**
         * Boolean for watching status
         * @type {boolean}
         */
        this.isWatching = false;
        this.angularVersionUtil = new utils_2.AngularVersionUtil();
        this.fileEngine = new file_engine_1.FileEngine();
        this.routerParser = new utils_2.RouterParserUtil();
        this.preparePipes = function (somePipes) {
            logger_1.logger.info('Prepare pipes');
            _this.configuration.mainData.pipes = (somePipes) ? somePipes : _this.dependenciesEngine.getPipes();
            return new Promise(function (resolve, reject) {
                var i = 0;
                var len = _this.configuration.mainData.pipes.length;
                var loop = function () {
                    if (i < len) {
                        if ($markdownengine.hasNeighbourReadmeFile(_this.configuration.mainData.pipes[i].file)) {
                            logger_1.logger.info(" " + _this.configuration.mainData.pipes[i].name + " has a README file, include it");
                            var readme = $markdownengine.readNeighbourReadmeFile(_this.configuration.mainData.pipes[i].file);
                            _this.configuration.mainData.pipes[i].readme = marked(readme);
                        }
                        _this.configuration.addPage({
                            path: 'pipes',
                            name: _this.configuration.mainData.pipes[i].name,
                            id: _this.configuration.mainData.pipes[i].id,
                            context: 'pipe',
                            pipe: _this.configuration.mainData.pipes[i],
                            depth: 1,
                            pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                        });
                        i++;
                        loop();
                    }
                    else {
                        resolve();
                    }
                };
                loop();
            });
        };
        this.prepareClasses = function (someClasses) {
            logger_1.logger.info('Prepare classes');
            _this.configuration.mainData.classes = (someClasses) ? someClasses : _this.dependenciesEngine.getClasses();
            return new Promise(function (resolve, reject) {
                var i = 0;
                var len = _this.configuration.mainData.classes.length;
                var loop = function () {
                    if (i < len) {
                        if ($markdownengine.hasNeighbourReadmeFile(_this.configuration.mainData.classes[i].file)) {
                            logger_1.logger.info(" " + _this.configuration.mainData.classes[i].name + " has a README file, include it");
                            var readme = $markdownengine.readNeighbourReadmeFile(_this.configuration.mainData.classes[i].file);
                            _this.configuration.mainData.classes[i].readme = marked(readme);
                        }
                        _this.configuration.addPage({
                            path: 'classes',
                            name: _this.configuration.mainData.classes[i].name,
                            id: _this.configuration.mainData.classes[i].id,
                            context: 'class',
                            class: _this.configuration.mainData.classes[i],
                            depth: 1,
                            pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                        });
                        i++;
                        loop();
                    }
                    else {
                        resolve();
                    }
                };
                loop();
            });
        };
        this.configuration = new configuration_1.Configuration();
        this.dependenciesEngine = new dependencies_engine_1.DependenciesEngine();
        this.ngdEngine = new ngd_engine_1.NgdEngine(this.dependenciesEngine);
        this.htmlEngine = new html_engine_1.HtmlEngine(this.configuration, this.dependenciesEngine, this.fileEngine);
        this.searchEngine = new search_engine_1.SearchEngine(this.configuration, this.fileEngine);
        this.exportEngine = new export_engine_1.ExportEngine(this.configuration, this.dependenciesEngine, this.fileEngine);
        for (var option in options) {
            if (typeof this.configuration.mainData[option] !== 'undefined') {
                this.configuration.mainData[option] = options[option];
            }
            // For documentationMainName, process it outside the loop, for handling conflict with pages name
            if (option === 'name') {
                this.configuration.mainData.documentationMainName = options[option];
            }
            // For documentationMainName, process it outside the loop, for handling conflict with pages name
            if (option === 'silent') {
                logger_1.logger.silent = false;
            }
        }
    }
    /**
     * Start compodoc process
     */
    Application.prototype.generate = function () {
        var _this = this;
        process.on('unhandledRejection', this.unhandledRejectionListener);
        process.on('uncaughtException', this.uncaughtExceptionListener);
        if (this.configuration.mainData.output.charAt(this.configuration.mainData.output.length - 1) !== '/') {
            this.configuration.mainData.output += '/';
        }
        if (this.configuration.mainData.exportFormat !== defaults_1.COMPODOC_DEFAULTS.exportFormat) {
            this.processPackageJson();
        }
        else {
            this.htmlEngine.init()
                .then(function () { return _this.processPackageJson(); });
        }
        return generationPromise;
    };
    Application.prototype.endCallback = function () {
        process.removeListener('unhandledRejection', this.unhandledRejectionListener);
        process.removeListener('uncaughtException', this.uncaughtExceptionListener);
    };
    Application.prototype.unhandledRejectionListener = function (err, p) {
        console.log('Unhandled Rejection at:', p, 'reason:', err);
        logger_1.logger.error('Sorry, but there was a problem during parsing or generation of the documentation. Please fill an issue on github. (https://github.com/compodoc/compodoc/issues/new)');
        process.exit(1);
    };
    Application.prototype.uncaughtExceptionListener = function (err) {
        logger_1.logger.error(err);
        logger_1.logger.error('Sorry, but there was a problem during parsing or generation of the documentation. Please fill an issue on github. (https://github.com/compodoc/compodoc/issues/new)');
        process.exit(1);
    };
    /**
     * Start compodoc documentation coverage
     */
    Application.prototype.testCoverage = function () {
        this.getDependenciesData();
    };
    /**
     * Store files for initial processing
     * @param  {Array<string>} files Files found during source folder and tsconfig scan
     */
    Application.prototype.setFiles = function (files) {
        this.files = files;
    };
    /**
     * Store files for watch processing
     * @param  {Array<string>} files Files found during source folder and tsconfig scan
     */
    Application.prototype.setUpdatedFiles = function (files) {
        this.updatedFiles = files;
    };
    /**
     * Return a boolean indicating presence of one TypeScript file in updatedFiles list
     * @return {boolean} Result of scan
     */
    Application.prototype.hasWatchedFilesTSFiles = function () {
        var result = false;
        _.forEach(this.updatedFiles, function (file) {
            if (path.extname(file) === '.ts') {
                result = true;
            }
        });
        return result;
    };
    /**
     * Return a boolean indicating presence of one root markdown files in updatedFiles list
     * @return {boolean} Result of scan
     */
    Application.prototype.hasWatchedFilesRootMarkdownFiles = function () {
        var result = false;
        _.forEach(this.updatedFiles, function (file) {
            if (path.extname(file) === '.md' && path.dirname(file) === process.cwd()) {
                result = true;
            }
        });
        return result;
    };
    /**
     * Clear files for watch processing
     */
    Application.prototype.clearUpdatedFiles = function () {
        this.updatedFiles = [];
        this.watchChangedFiles = [];
    };
    Application.prototype.processPackageJson = function () {
        var _this = this;
        logger_1.logger.info('Searching package.json file');
        this.fileEngine.get(process.cwd() + path.sep + 'package.json').then(function (packageData) {
            var parsedData = JSON.parse(packageData);
            if (typeof parsedData.name !== 'undefined' && _this.configuration.mainData.documentationMainName === defaults_1.COMPODOC_DEFAULTS.title) {
                _this.configuration.mainData.documentationMainName = parsedData.name + ' documentation';
            }
            if (typeof parsedData.description !== 'undefined') {
                _this.configuration.mainData.documentationMainDescription = parsedData.description;
            }
            _this.configuration.mainData.angularVersion = _this.angularVersionUtil.getAngularVersionOfProject(parsedData);
            logger_1.logger.info('package.json file found');
            _this.processMarkdowns().then(function () {
                _this.getDependenciesData();
            }, function (errorMessage) {
                logger_1.logger.error(errorMessage);
            });
        }, function (errorMessage) {
            logger_1.logger.error(errorMessage);
            logger_1.logger.error('Continuing without package.json file');
            _this.processMarkdowns().then(function () {
                _this.getDependenciesData();
            }, function (errorMessage1) {
                logger_1.logger.error(errorMessage1);
            });
        });
    };
    Application.prototype.processMarkdowns = function () {
        var _this = this;
        logger_1.logger.info('Searching README.md, CHANGELOG.md, CONTRIBUTING.md, LICENSE.md, TODO.md files');
        return new Promise(function (resolve, reject) {
            var i = 0;
            var markdowns = ['readme', 'changelog', 'contributing', 'license', 'todo'];
            var numberOfMarkdowns = 5;
            var loop = function () {
                if (i < numberOfMarkdowns) {
                    $markdownengine.getTraditionalMarkdown(markdowns[i].toUpperCase()).then(function (readmeData) {
                        _this.configuration.addPage({
                            name: (markdowns[i] === 'readme') ? 'index' : markdowns[i],
                            context: 'getting-started',
                            id: 'getting-started',
                            markdown: readmeData,
                            depth: 0,
                            pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
                        });
                        if (markdowns[i] === 'readme') {
                            _this.configuration.mainData.readme = true;
                            _this.configuration.addPage({
                                name: 'overview',
                                id: 'overview',
                                context: 'overview',
                                pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
                            });
                        }
                        else {
                            _this.configuration.mainData.markdowns.push({
                                name: markdowns[i],
                                uppername: markdowns[i].toUpperCase(),
                                depth: 0,
                                pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
                            });
                        }
                        logger_1.logger.info(markdowns[i].toUpperCase() + ".md file found");
                        i++;
                        loop();
                    }, function (errorMessage) {
                        logger_1.logger.warn(errorMessage);
                        logger_1.logger.warn("Continuing without " + markdowns[i].toUpperCase() + ".md file");
                        if (markdowns[i] === 'readme') {
                            _this.configuration.addPage({
                                name: 'index',
                                id: 'index',
                                context: 'overview'
                            });
                        }
                        i++;
                        loop();
                    });
                }
                else {
                    resolve();
                }
            };
            loop();
        });
    };
    Application.prototype.rebuildRootMarkdowns = function () {
        var _this = this;
        logger_1.logger.info('Regenerating README.md, CHANGELOG.md, CONTRIBUTING.md, LICENSE.md, TODO.md pages');
        var actions = [];
        this.configuration.resetRootMarkdownPages();
        actions.push(function () { return _this.processMarkdowns(); });
        promise_sequential_1.promiseSequential(actions)
            .then(function (res) {
            _this.processPages();
            _this.clearUpdatedFiles();
        })
            .catch(function (errorMessage) {
            logger_1.logger.error(errorMessage);
        });
    };
    /**
     * Get dependency data for small group of updated files during watch process
     */
    Application.prototype.getMicroDependenciesData = function () {
        logger_1.logger.info('Get diff dependencies data');
        var crawler = new dependencies_1.Dependencies(this.updatedFiles, {
            tsconfigDirectory: path.dirname(this.configuration.mainData.tsconfig)
        }, this.configuration, this.routerParser);
        var dependenciesData = crawler.getDependencies();
        this.dependenciesEngine.update(dependenciesData);
        this.prepareJustAFewThings(dependenciesData);
    };
    /**
     * Rebuild external documentation during watch process
     */
    Application.prototype.rebuildExternalDocumentation = function () {
        var _this = this;
        logger_1.logger.info('Rebuild external documentation');
        var actions = [];
        this.configuration.resetAdditionalPages();
        if (this.configuration.mainData.includes !== '') {
            actions.push(function () { return _this.prepareExternalIncludes(); });
        }
        promise_sequential_1.promiseSequential(actions)
            .then(function (res) {
            _this.processPages();
            _this.clearUpdatedFiles();
        })
            .catch(function (errorMessage) {
            logger_1.logger.error(errorMessage);
        });
    };
    Application.prototype.getDependenciesData = function () {
        logger_1.logger.info('Get dependencies data');
        var crawler = new dependencies_1.Dependencies(this.files, {
            tsconfigDirectory: path.dirname(this.configuration.mainData.tsconfig)
        }, this.configuration, this.routerParser);
        var dependenciesData = crawler.getDependencies();
        this.dependenciesEngine.init(dependenciesData);
        this.configuration.mainData.routesLength = this.routerParser.routesLength();
        this.printStatistics();
        this.prepareEverything();
    };
    Application.prototype.prepareJustAFewThings = function (diffCrawledData) {
        var _this = this;
        var actions = [];
        this.configuration.resetPages();
        actions.push(function () { return _this.prepareRoutes(); });
        if (diffCrawledData.modules.length > 0) {
            actions.push(function () { return _this.prepareModules(); });
        }
        if (diffCrawledData.components.length > 0) {
            actions.push(function () { return _this.prepareComponents(); });
        }
        if (diffCrawledData.directives.length > 0) {
            actions.push(function () { return _this.prepareDirectives(); });
        }
        if (diffCrawledData.injectables.length > 0) {
            actions.push(function () { return _this.prepareInjectables(); });
        }
        if (diffCrawledData.interceptors.length > 0) {
            actions.push(function () { return _this.prepareInterceptors(); });
        }
        if (diffCrawledData.pipes.length > 0) {
            actions.push(function () { return _this.preparePipes(); });
        }
        if (diffCrawledData.classes.length > 0) {
            actions.push(function () { return _this.prepareClasses(); });
        }
        if (diffCrawledData.interfaces.length > 0) {
            actions.push(function () { return _this.prepareInterfaces(); });
        }
        if (diffCrawledData.miscellaneous.variables.length > 0 ||
            diffCrawledData.miscellaneous.functions.length > 0 ||
            diffCrawledData.miscellaneous.typealiases.length > 0 ||
            diffCrawledData.miscellaneous.enumerations.length > 0) {
            actions.push(function () { return _this.prepareMiscellaneous(); });
        }
        if (!this.configuration.mainData.disableCoverage) {
            actions.push(function () { return _this.prepareCoverage(); });
        }
        promise_sequential_1.promiseSequential(actions)
            .then(function (res) {
            _this.processGraphs();
            _this.clearUpdatedFiles();
        })
            .catch(function (errorMessage) {
            logger_1.logger.error(errorMessage);
        });
    };
    Application.prototype.printStatistics = function () {
        logger_1.logger.info('-------------------');
        logger_1.logger.info('Project statistics ');
        if (this.dependenciesEngine.modules.length > 0) {
            logger_1.logger.info("- module     : " + this.dependenciesEngine.modules.length);
        }
        if (this.dependenciesEngine.components.length > 0) {
            logger_1.logger.info("- component  : " + this.dependenciesEngine.components.length);
        }
        if (this.dependenciesEngine.directives.length > 0) {
            logger_1.logger.info("- directive  : " + this.dependenciesEngine.directives.length);
        }
        if (this.dependenciesEngine.injectables.length > 0) {
            logger_1.logger.info("- injectable : " + this.dependenciesEngine.injectables.length);
        }
        if (this.dependenciesEngine.interceptors.length > 0) {
            logger_1.logger.info("- injector   : " + this.dependenciesEngine.interceptors.length);
        }
        if (this.dependenciesEngine.pipes.length > 0) {
            logger_1.logger.info("- pipe       : " + this.dependenciesEngine.pipes.length);
        }
        if (this.dependenciesEngine.classes.length > 0) {
            logger_1.logger.info("- class      : " + this.dependenciesEngine.classes.length);
        }
        if (this.dependenciesEngine.interfaces.length > 0) {
            logger_1.logger.info("- interface  : " + this.dependenciesEngine.interfaces.length);
        }
        if (this.configuration.mainData.routesLength > 0) {
            logger_1.logger.info("- route      : " + this.configuration.mainData.routesLength);
        }
        logger_1.logger.info('-------------------');
    };
    Application.prototype.prepareEverything = function () {
        var _this = this;
        var actions = [];
        actions.push(function () { return _this.prepareModules(); });
        actions.push(function () { return _this.prepareComponents(); });
        if (this.dependenciesEngine.directives.length > 0) {
            actions.push(function () { return _this.prepareDirectives(); });
        }
        if (this.dependenciesEngine.injectables.length > 0) {
            actions.push(function () { return _this.prepareInjectables(); });
        }
        if (this.dependenciesEngine.interceptors.length > 0) {
            actions.push(function () { return _this.prepareInterceptors(); });
        }
        if (this.dependenciesEngine.routes && this.dependenciesEngine.routes.children.length > 0) {
            actions.push(function () { return _this.prepareRoutes(); });
        }
        if (this.dependenciesEngine.pipes.length > 0) {
            actions.push(function () { return _this.preparePipes(); });
        }
        if (this.dependenciesEngine.classes.length > 0) {
            actions.push(function () { return _this.prepareClasses(); });
        }
        if (this.dependenciesEngine.interfaces.length > 0) {
            actions.push(function () { return _this.prepareInterfaces(); });
        }
        if (this.dependenciesEngine.miscellaneous.variables.length > 0 ||
            this.dependenciesEngine.miscellaneous.functions.length > 0 ||
            this.dependenciesEngine.miscellaneous.typealiases.length > 0 ||
            this.dependenciesEngine.miscellaneous.enumerations.length > 0) {
            actions.push(function () { return _this.prepareMiscellaneous(); });
        }
        if (!this.configuration.mainData.disableCoverage) {
            actions.push(function () { return _this.prepareCoverage(); });
        }
        if (this.configuration.mainData.includes !== '') {
            actions.push(function () { return _this.prepareExternalIncludes(); });
        }
        promise_sequential_1.promiseSequential(actions)
            .then(function (res) {
            if (_this.configuration.mainData.exportFormat !== defaults_1.COMPODOC_DEFAULTS.exportFormat) {
                if (defaults_1.COMPODOC_DEFAULTS.exportFormatsSupported.indexOf(_this.configuration.mainData.exportFormat) > -1) {
                    logger_1.logger.info("Generating documentation in export format " + _this.configuration.mainData.exportFormat);
                    _this.exportEngine.export(_this.configuration.mainData.output, _this.configuration.mainData).then(function () {
                        generationPromiseResolve();
                        _this.endCallback();
                        logger_1.logger.info('Documentation generated in ' + _this.configuration.mainData.output +
                            ' in ' + _this.getElapsedTime() + ' seconds');
                    });
                }
                else {
                    logger_1.logger.warn("Exported format not supported");
                }
            }
            else {
                _this.processGraphs();
            }
        })
            .catch(function (errorMessage) {
            logger_1.logger.error(errorMessage);
        });
    };
    Application.prototype.prepareExternalIncludes = function () {
        var _this = this;
        logger_1.logger.info('Adding external markdown files');
        // Scan include folder for files detailed in summary.json
        // For each file, add to this.configuration.mainData.additionalPages
        // Each file will be converted to html page, inside COMPODOC_DEFAULTS.additionalEntryPath
        return new Promise(function (resolve, reject) {
            _this.fileEngine.get(process.cwd() + path.sep + _this.configuration.mainData.includes + path.sep + 'summary.json')
                .then(function (summaryData) {
                logger_1.logger.info('Additional documentation: summary.json file found');
                var parsedSummaryData = JSON.parse(summaryData);
                var i = 0;
                var len = parsedSummaryData.length;
                var loop = function () {
                    if (i <= len - 1) {
                        $markdownengine.getTraditionalMarkdown(_this.configuration.mainData.includes + path.sep + parsedSummaryData[i].file)
                            .then(function (markedData) {
                            _this.configuration.addAdditionalPage({
                                name: parsedSummaryData[i].title,
                                id: parsedSummaryData[i].title,
                                filename: utilities_1.cleanNameWithoutSpaceAndToLowerCase(parsedSummaryData[i].title),
                                context: 'additional-page',
                                path: _this.configuration.mainData.includesFolder,
                                additionalPage: markedData,
                                depth: 1,
                                pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                            });
                            if (parsedSummaryData[i].children && parsedSummaryData[i].children.length > 0) {
                                var j_1 = 0;
                                var leng_1 = parsedSummaryData[i].children.length;
                                var loopChild_1 = function () {
                                    if (j_1 <= leng_1 - 1) {
                                        $markdownengine
                                            .getTraditionalMarkdown(_this.configuration.mainData.includes + path.sep + parsedSummaryData[i].children[j_1].file)
                                            .then(function (markedData) {
                                            _this.configuration.addAdditionalPage({
                                                name: parsedSummaryData[i].children[j_1].title,
                                                id: parsedSummaryData[i].children[j_1].title,
                                                filename: utilities_1.cleanNameWithoutSpaceAndToLowerCase(parsedSummaryData[i].children[j_1].title),
                                                context: 'additional-page',
                                                path: _this.configuration.mainData.includesFolder + '/' + utilities_1.cleanNameWithoutSpaceAndToLowerCase(parsedSummaryData[i].title),
                                                additionalPage: markedData,
                                                depth: 2,
                                                pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                                            });
                                            j_1++;
                                            loopChild_1();
                                        }, function (e) {
                                            logger_1.logger.error(e);
                                        });
                                    }
                                    else {
                                        i++;
                                        loop();
                                    }
                                };
                                loopChild_1();
                            }
                            else {
                                i++;
                                loop();
                            }
                        }, function (e) {
                            logger_1.logger.error(e);
                        });
                    }
                    else {
                        resolve();
                    }
                };
                loop();
            }, function (errorMessage) {
                logger_1.logger.error(errorMessage);
                reject('Error during Additional documentation generation');
            });
        });
    };
    Application.prototype.prepareModules = function (someModules) {
        var _this = this;
        logger_1.logger.info('Prepare modules');
        var i = 0;
        var _modules = (someModules) ? someModules : this.dependenciesEngine.getModules();
        return new Promise(function (resolve, reject) {
            _this.configuration.mainData.modules = _modules.map(function (ngModule) {
                ['declarations', 'bootstrap', 'imports', 'exports'].forEach(function (metadataType) {
                    ngModule[metadataType] = ngModule[metadataType].filter(function (metaDataItem) {
                        switch (metaDataItem.type) {
                            case 'directive':
                                return _this.dependenciesEngine.getDirectives().some(function (directive) { return directive.name === metaDataItem.name; });
                            case 'component':
                                return _this.dependenciesEngine.getComponents().some(function (component) { return component.name === metaDataItem.name; });
                            case 'module':
                                return _this.dependenciesEngine.getModules().some(function (module) { return module.name === metaDataItem.name; });
                            case 'pipe':
                                return _this.dependenciesEngine.getPipes().some(function (pipe) { return pipe.name === metaDataItem.name; });
                            default:
                                return true;
                        }
                    });
                });
                ngModule.providers = ngModule.providers.filter(function (provider) {
                    return _this.dependenciesEngine.getInjectables().some(function (injectable) { return injectable.name === provider.name; }) ||
                        _this.dependenciesEngine.getInterceptors().some(function (interceptor) { return interceptor.name === provider.name; });
                });
                // Try fixing type undefined for each providers
                _.forEach(ngModule.providers, function (provider) {
                    if (_this.dependenciesEngine.getInjectables().find(function (injectable) { return injectable.name === provider.name; })) {
                        provider.type = 'injectable';
                    }
                    if (_this.dependenciesEngine.getInterceptors().find(function (interceptor) { return interceptor.name === provider.name; })) {
                        provider.type = 'interceptor';
                    }
                });
                return ngModule;
            });
            _this.configuration.addPage({
                name: 'modules',
                id: 'modules',
                context: 'modules',
                depth: 0,
                pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
            });
            var len = _this.configuration.mainData.modules.length;
            var loop = function () {
                if (i < len) {
                    if ($markdownengine.hasNeighbourReadmeFile(_this.configuration.mainData.modules[i].file)) {
                        logger_1.logger.info(" " + _this.configuration.mainData.modules[i].name + " has a README file, include it");
                        var readme = $markdownengine.readNeighbourReadmeFile(_this.configuration.mainData.modules[i].file);
                        _this.configuration.mainData.modules[i].readme = marked(readme);
                    }
                    _this.configuration.addPage({
                        path: 'modules',
                        name: _this.configuration.mainData.modules[i].name,
                        id: _this.configuration.mainData.modules[i].id,
                        context: 'module',
                        module: _this.configuration.mainData.modules[i],
                        depth: 1,
                        pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    });
                    i++;
                    loop();
                }
                else {
                    resolve();
                }
            };
            loop();
        });
    };
    Application.prototype.prepareInterfaces = function (someInterfaces) {
        var _this = this;
        logger_1.logger.info('Prepare interfaces');
        this.configuration.mainData.interfaces = (someInterfaces) ? someInterfaces : this.dependenciesEngine.getInterfaces();
        return new Promise(function (resolve, reject) {
            var i = 0;
            var len = _this.configuration.mainData.interfaces.length;
            var loop = function () {
                if (i < len) {
                    if ($markdownengine.hasNeighbourReadmeFile(_this.configuration.mainData.interfaces[i].file)) {
                        logger_1.logger.info(" " + _this.configuration.mainData.interfaces[i].name + " has a README file, include it");
                        var readme = $markdownengine.readNeighbourReadmeFile(_this.configuration.mainData.interfaces[i].file);
                        _this.configuration.mainData.interfaces[i].readme = marked(readme);
                    }
                    _this.configuration.addPage({
                        path: 'interfaces',
                        name: _this.configuration.mainData.interfaces[i].name,
                        id: _this.configuration.mainData.interfaces[i].id,
                        context: 'interface',
                        interface: _this.configuration.mainData.interfaces[i],
                        depth: 1,
                        pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    });
                    i++;
                    loop();
                }
                else {
                    resolve();
                }
            };
            loop();
        });
    };
    Application.prototype.prepareMiscellaneous = function (someMisc) {
        var _this = this;
        logger_1.logger.info('Prepare miscellaneous');
        this.configuration.mainData.miscellaneous = (someMisc) ? someMisc : this.dependenciesEngine.getMiscellaneous();
        return new Promise(function (resolve, reject) {
            if (_this.configuration.mainData.miscellaneous.functions.length > 0) {
                _this.configuration.addPage({
                    path: 'miscellaneous',
                    name: 'functions',
                    id: 'miscellaneous-functions',
                    context: 'miscellaneous-functions',
                    depth: 1,
                    pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                });
            }
            if (_this.configuration.mainData.miscellaneous.variables.length > 0) {
                _this.configuration.addPage({
                    path: 'miscellaneous',
                    name: 'variables',
                    id: 'miscellaneous-variables',
                    context: 'miscellaneous-variables',
                    depth: 1,
                    pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                });
            }
            if (_this.configuration.mainData.miscellaneous.typealiases.length > 0) {
                _this.configuration.addPage({
                    path: 'miscellaneous',
                    name: 'typealiases',
                    id: 'miscellaneous-typealiases',
                    context: 'miscellaneous-typealiases',
                    depth: 1,
                    pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                });
            }
            if (_this.configuration.mainData.miscellaneous.enumerations.length > 0) {
                _this.configuration.addPage({
                    path: 'miscellaneous',
                    name: 'enumerations',
                    id: 'miscellaneous-enumerations',
                    context: 'miscellaneous-enumerations',
                    depth: 1,
                    pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                });
            }
            resolve();
        });
    };
    Application.prototype.handleTemplateurl = function (component) {
        var dirname = path.dirname(component.file);
        var templatePath = path.resolve(dirname + path.sep + component.templateUrl);
        if (!this.fileEngine.existsSync(templatePath)) {
            var err = "Cannot read template for " + component.name;
            logger_1.logger.error(err);
            return new Promise(function (resolve, reject) { });
        }
        return this.fileEngine.get(templatePath)
            .then(function (data) { return component.templateData = data; }, function (err) {
            logger_1.logger.error(err);
            return Promise.reject('');
        });
    };
    Application.prototype.prepareComponents = function (someComponents) {
        var _this = this;
        logger_1.logger.info('Prepare components');
        this.configuration.mainData.components = (someComponents) ? someComponents : this.dependenciesEngine.getComponents();
        return new Promise(function (mainResolve, reject) {
            var i = 0;
            var len = _this.configuration.mainData.components.length;
            var loop = function () {
                if (i <= len - 1) {
                    if ($markdownengine.hasNeighbourReadmeFile(_this.configuration.mainData.components[i].file)) {
                        logger_1.logger.info(" " + _this.configuration.mainData.components[i].name + " has a README file, include it");
                        var readmeFile = $markdownengine.readNeighbourReadmeFile(_this.configuration.mainData.components[i].file);
                        _this.configuration.mainData.components[i].readme = marked(readmeFile);
                        _this.configuration.addPage({
                            path: 'components',
                            name: _this.configuration.mainData.components[i].name,
                            id: _this.configuration.mainData.components[i].id,
                            context: 'component',
                            component: _this.configuration.mainData.components[i],
                            depth: 1,
                            pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                        });
                        if (_this.configuration.mainData.components[i].templateUrl.length > 0) {
                            logger_1.logger.info(" " + _this.configuration.mainData.components[i].name + " has a templateUrl, include it");
                            _this.handleTemplateurl(_this.configuration.mainData.components[i]).then(function () {
                                i++;
                                loop();
                            }, function (e) {
                                logger_1.logger.error(e);
                            });
                        }
                        else {
                            i++;
                            loop();
                        }
                    }
                    else {
                        _this.configuration.addPage({
                            path: 'components',
                            name: _this.configuration.mainData.components[i].name,
                            id: _this.configuration.mainData.components[i].id,
                            context: 'component',
                            component: _this.configuration.mainData.components[i],
                            depth: 1,
                            pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                        });
                        if (_this.configuration.mainData.components[i].templateUrl.length > 0) {
                            logger_1.logger.info(" " + _this.configuration.mainData.components[i].name + " has a templateUrl, include it");
                            _this.handleTemplateurl(_this.configuration.mainData.components[i]).then(function () {
                                i++;
                                loop();
                            }, function (e) {
                                logger_1.logger.error(e);
                            });
                        }
                        else {
                            i++;
                            loop();
                        }
                    }
                }
                else {
                    mainResolve();
                }
            };
            loop();
        });
    };
    Application.prototype.prepareDirectives = function (someDirectives) {
        var _this = this;
        logger_1.logger.info('Prepare directives');
        this.configuration.mainData.directives = (someDirectives) ? someDirectives : this.dependenciesEngine.getDirectives();
        return new Promise(function (resolve, reject) {
            var i = 0;
            var len = _this.configuration.mainData.directives.length;
            var loop = function () {
                if (i < len) {
                    if ($markdownengine.hasNeighbourReadmeFile(_this.configuration.mainData.directives[i].file)) {
                        logger_1.logger.info(" " + _this.configuration.mainData.directives[i].name + " has a README file, include it");
                        var readme = $markdownengine.readNeighbourReadmeFile(_this.configuration.mainData.directives[i].file);
                        _this.configuration.mainData.directives[i].readme = marked(readme);
                    }
                    _this.configuration.addPage({
                        path: 'directives',
                        name: _this.configuration.mainData.directives[i].name,
                        id: _this.configuration.mainData.directives[i].id,
                        context: 'directive',
                        directive: _this.configuration.mainData.directives[i],
                        depth: 1,
                        pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    });
                    i++;
                    loop();
                }
                else {
                    resolve();
                }
            };
            loop();
        });
    };
    Application.prototype.prepareInjectables = function (someInjectables) {
        var _this = this;
        logger_1.logger.info('Prepare injectables');
        this.configuration.mainData.injectables = (someInjectables) ? someInjectables : this.dependenciesEngine.getInjectables();
        return new Promise(function (resolve, reject) {
            var i = 0;
            var len = _this.configuration.mainData.injectables.length;
            var loop = function () {
                if (i < len) {
                    if ($markdownengine.hasNeighbourReadmeFile(_this.configuration.mainData.injectables[i].file)) {
                        logger_1.logger.info(" " + _this.configuration.mainData.injectables[i].name + " has a README file, include it");
                        var readme = $markdownengine.readNeighbourReadmeFile(_this.configuration.mainData.injectables[i].file);
                        _this.configuration.mainData.injectables[i].readme = marked(readme);
                    }
                    _this.configuration.addPage({
                        path: 'injectables',
                        name: _this.configuration.mainData.injectables[i].name,
                        id: _this.configuration.mainData.injectables[i].id,
                        context: 'injectable',
                        injectable: _this.configuration.mainData.injectables[i],
                        depth: 1,
                        pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    });
                    i++;
                    loop();
                }
                else {
                    resolve();
                }
            };
            loop();
        });
    };
    Application.prototype.prepareInterceptors = function (someInterceptors) {
        var _this = this;
        logger_1.logger.info('Prepare interceptors');
        this.configuration.mainData.interceptors = (someInterceptors) ? someInterceptors : this.dependenciesEngine.getInterceptors();
        return new Promise(function (resolve, reject) {
            var i = 0;
            var len = _this.configuration.mainData.interceptors.length;
            var loop = function () {
                if (i < len) {
                    if ($markdownengine.hasNeighbourReadmeFile(_this.configuration.mainData.interceptors[i].file)) {
                        logger_1.logger.info(" " + _this.configuration.mainData.interceptors[i].name + " has a README file, include it");
                        var readme = $markdownengine.readNeighbourReadmeFile(_this.configuration.mainData.interceptors[i].file);
                        _this.configuration.mainData.interceptors[i].readme = marked(readme);
                    }
                    _this.configuration.addPage({
                        path: 'interceptors',
                        name: _this.configuration.mainData.interceptors[i].name,
                        id: _this.configuration.mainData.interceptors[i].id,
                        context: 'interceptor',
                        injectable: _this.configuration.mainData.interceptors[i],
                        depth: 1,
                        pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    });
                    i++;
                    loop();
                }
                else {
                    resolve();
                }
            };
            loop();
        });
    };
    Application.prototype.prepareRoutes = function () {
        var _this = this;
        logger_1.logger.info('Process routes');
        this.configuration.mainData.routes = this.dependenciesEngine.getRoutes();
        return new Promise(function (resolve, reject) {
            _this.configuration.addPage({
                name: 'routes',
                id: 'routes',
                context: 'routes',
                depth: 0,
                pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
            });
            if (_this.configuration.mainData.exportFormat === defaults_1.COMPODOC_DEFAULTS.exportFormat) {
                _this.routerParser.generateRoutesIndex(_this.configuration.mainData.output, _this.configuration.mainData.routes).then(function () {
                    logger_1.logger.info(' Routes index generated');
                    resolve();
                }, function (e) {
                    logger_1.logger.error(e);
                    reject();
                });
            }
            else {
                resolve();
            }
        });
    };
    Application.prototype.prepareCoverage = function () {
        var _this = this;
        logger_1.logger.info('Process documentation coverage report');
        return new Promise(function (resolve, reject) {
            /*
             * loop with components, directives, classes, injectables, interfaces, pipes
             */
            var files = [];
            var totalProjectStatementDocumented = 0;
            var getStatus = function (percent) {
                var status;
                if (percent <= 25) {
                    status = 'low';
                }
                else if (percent > 25 && percent <= 50) {
                    status = 'medium';
                }
                else if (percent > 50 && percent <= 75) {
                    status = 'good';
                }
                else {
                    status = 'very-good';
                }
                return status;
            };
            var processComponentsAndDirectives = function (list) {
                _.forEach(list, function (element) {
                    if (!element.propertiesClass ||
                        !element.methodsClass ||
                        !element.hostBindings ||
                        !element.hostListeners ||
                        !element.inputsClass ||
                        !element.outputsClass) {
                        return;
                    }
                    var cl = {
                        filePath: element.file,
                        type: element.type,
                        linktype: element.type,
                        name: element.name
                    };
                    var totalStatementDocumented = 0;
                    var totalStatements = element.propertiesClass.length +
                        element.methodsClass.length +
                        element.inputsClass.length +
                        element.hostBindings.length +
                        element.hostListeners.length +
                        element.outputsClass.length + 1; // +1 for element decorator comment
                    if (element.constructorObj) {
                        totalStatements += 1;
                        if (element.constructorObj && element.constructorObj.description && element.constructorObj.description !== '') {
                            totalStatementDocumented += 1;
                        }
                    }
                    if (element.description && element.description !== '') {
                        totalStatementDocumented += 1;
                    }
                    _.forEach(element.propertiesClass, function (property) {
                        if (property.modifierKind === ts.SyntaxKind.PrivateKeyword) {
                            totalStatements -= 1;
                        }
                        if (property.description && property.description !== '' && property.modifierKind !== ts.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    _.forEach(element.methodsClass, function (method) {
                        if (method.modifierKind === ts.SyntaxKind.PrivateKeyword) {
                            totalStatements -= 1;
                        }
                        if (method.description && method.description !== '' && method.modifierKind !== ts.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    _.forEach(element.hostBindings, function (property) {
                        if (property.modifierKind === ts.SyntaxKind.PrivateKeyword) {
                            totalStatements -= 1;
                        }
                        if (property.description && property.description !== '' && property.modifierKind !== ts.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    _.forEach(element.hostListeners, function (method) {
                        if (method.modifierKind === ts.SyntaxKind.PrivateKeyword) {
                            totalStatements -= 1;
                        }
                        if (method.description && method.description !== '' && method.modifierKind !== ts.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    _.forEach(element.inputsClass, function (input) {
                        if (input.modifierKind === ts.SyntaxKind.PrivateKeyword) {
                            totalStatements -= 1;
                        }
                        if (input.description && input.description !== '' && input.modifierKind !== ts.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    _.forEach(element.outputsClass, function (output) {
                        if (output.modifierKind === ts.SyntaxKind.PrivateKeyword) {
                            totalStatements -= 1;
                        }
                        if (output.description && output.description !== '' && output.modifierKind !== ts.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    cl.coveragePercent = Math.floor((totalStatementDocumented / totalStatements) * 100);
                    if (totalStatements === 0) {
                        cl.coveragePercent = 0;
                    }
                    cl.coverageCount = totalStatementDocumented + '/' + totalStatements;
                    cl.status = getStatus(cl.coveragePercent);
                    totalProjectStatementDocumented += cl.coveragePercent;
                    files.push(cl);
                });
            };
            var processCoveragePerFile = function () {
                logger_1.logger.info('Process documentation coverage per file');
                logger_1.logger.info('-------------------');
                var overFiles = files.filter(function (f) {
                    var overTest = f.coveragePercent >= _this.configuration.mainData.coverageMinimumPerFile;
                    if (overTest) {
                        logger_1.logger.info(f.coveragePercent + " % for file " + f.filePath + " - over minimum per file");
                    }
                    return overTest;
                });
                var underFiles = files.filter(function (f) {
                    var underTest = f.coveragePercent < _this.configuration.mainData.coverageMinimumPerFile;
                    if (underTest) {
                        logger_1.logger.error(f.coveragePercent + " % for file " + f.filePath + " - under minimum per file");
                    }
                    return underTest;
                });
                logger_1.logger.info('-------------------');
                return {
                    overFiles: overFiles,
                    underFiles: underFiles
                };
            };
            processComponentsAndDirectives(_this.configuration.mainData.components);
            processComponentsAndDirectives(_this.configuration.mainData.directives);
            _.forEach(_this.configuration.mainData.classes, function (classe) {
                if (!classe.properties ||
                    !classe.methods) {
                    return;
                }
                var cl = {
                    filePath: classe.file,
                    type: 'class',
                    linktype: 'classe',
                    name: classe.name
                };
                var totalStatementDocumented = 0;
                var totalStatements = classe.properties.length + classe.methods.length + 1; // +1 for class itself
                if (classe.constructorObj) {
                    totalStatements += 1;
                    if (classe.constructorObj && classe.constructorObj.description && classe.constructorObj.description !== '') {
                        totalStatementDocumented += 1;
                    }
                }
                if (classe.description && classe.description !== '') {
                    totalStatementDocumented += 1;
                }
                _.forEach(classe.properties, function (property) {
                    if (property.modifierKind === ts.SyntaxKind.PrivateKeyword) {
                        totalStatements -= 1;
                    }
                    if (property.description && property.description !== '' && property.modifierKind !== ts.SyntaxKind.PrivateKeyword) {
                        totalStatementDocumented += 1;
                    }
                });
                _.forEach(classe.methods, function (method) {
                    if (method.modifierKind === ts.SyntaxKind.PrivateKeyword) {
                        totalStatements -= 1;
                    }
                    if (method.description && method.description !== '' && method.modifierKind !== ts.SyntaxKind.PrivateKeyword) {
                        totalStatementDocumented += 1;
                    }
                });
                cl.coveragePercent = Math.floor((totalStatementDocumented / totalStatements) * 100);
                if (totalStatements === 0) {
                    cl.coveragePercent = 0;
                }
                cl.coverageCount = totalStatementDocumented + '/' + totalStatements;
                cl.status = getStatus(cl.coveragePercent);
                totalProjectStatementDocumented += cl.coveragePercent;
                files.push(cl);
            });
            _.forEach(_this.configuration.mainData.injectables, function (injectable) {
                if (!injectable.properties ||
                    !injectable.methods) {
                    return;
                }
                var cl = {
                    filePath: injectable.file,
                    type: injectable.type,
                    linktype: injectable.type,
                    name: injectable.name
                };
                var totalStatementDocumented = 0;
                var totalStatements = injectable.properties.length + injectable.methods.length + 1; // +1 for injectable itself
                if (injectable.constructorObj) {
                    totalStatements += 1;
                    if (injectable.constructorObj &&
                        injectable.constructorObj.description &&
                        injectable.constructorObj.description !== '') {
                        totalStatementDocumented += 1;
                    }
                }
                if (injectable.description && injectable.description !== '') {
                    totalStatementDocumented += 1;
                }
                _.forEach(injectable.properties, function (property) {
                    if (property.modifierKind === ts.SyntaxKind.PrivateKeyword) {
                        totalStatements -= 1;
                    }
                    if (property.description && property.description !== '' && property.modifierKind !== ts.SyntaxKind.PrivateKeyword) {
                        totalStatementDocumented += 1;
                    }
                });
                _.forEach(injectable.methods, function (method) {
                    if (method.modifierKind === ts.SyntaxKind.PrivateKeyword) {
                        totalStatements -= 1;
                    }
                    if (method.description && method.description !== '' && method.modifierKind !== ts.SyntaxKind.PrivateKeyword) {
                        totalStatementDocumented += 1;
                    }
                });
                cl.coveragePercent = Math.floor((totalStatementDocumented / totalStatements) * 100);
                if (totalStatements === 0) {
                    cl.coveragePercent = 0;
                }
                cl.coverageCount = totalStatementDocumented + '/' + totalStatements;
                cl.status = getStatus(cl.coveragePercent);
                totalProjectStatementDocumented += cl.coveragePercent;
                files.push(cl);
            });
            _.forEach(_this.configuration.mainData.interfaces, function (inter) {
                if (!inter.properties ||
                    !inter.methods) {
                    return;
                }
                var cl = {
                    filePath: inter.file,
                    type: inter.type,
                    linktype: inter.type,
                    name: inter.name
                };
                var totalStatementDocumented = 0;
                var totalStatements = inter.properties.length + inter.methods.length + 1; // +1 for interface itself
                if (inter.constructorObj) {
                    totalStatements += 1;
                    if (inter.constructorObj && inter.constructorObj.description && inter.constructorObj.description !== '') {
                        totalStatementDocumented += 1;
                    }
                }
                if (inter.description && inter.description !== '') {
                    totalStatementDocumented += 1;
                }
                _.forEach(inter.properties, function (property) {
                    if (property.modifierKind === ts.SyntaxKind.PrivateKeyword) {
                        totalStatements -= 1;
                    }
                    if (property.description && property.description !== '' && property.modifierKind !== ts.SyntaxKind.PrivateKeyword) {
                        totalStatementDocumented += 1;
                    }
                });
                _.forEach(inter.methods, function (method) {
                    if (method.modifierKind === ts.SyntaxKind.PrivateKeyword) {
                        totalStatements -= 1;
                    }
                    if (method.description && method.description !== '' && method.modifierKind !== ts.SyntaxKind.PrivateKeyword) {
                        totalStatementDocumented += 1;
                    }
                });
                cl.coveragePercent = Math.floor((totalStatementDocumented / totalStatements) * 100);
                if (totalStatements === 0) {
                    cl.coveragePercent = 0;
                }
                cl.coverageCount = totalStatementDocumented + '/' + totalStatements;
                cl.status = getStatus(cl.coveragePercent);
                totalProjectStatementDocumented += cl.coveragePercent;
                files.push(cl);
            });
            _.forEach(_this.configuration.mainData.pipes, function (pipe) {
                var cl = {
                    filePath: pipe.file,
                    type: pipe.type,
                    linktype: pipe.type,
                    name: pipe.name
                };
                var totalStatementDocumented = 0;
                var totalStatements = 1;
                if (pipe.description && pipe.description !== '') {
                    totalStatementDocumented += 1;
                }
                cl.coveragePercent = Math.floor((totalStatementDocumented / totalStatements) * 100);
                cl.coverageCount = totalStatementDocumented + '/' + totalStatements;
                cl.status = getStatus(cl.coveragePercent);
                totalProjectStatementDocumented += cl.coveragePercent;
                files.push(cl);
            });
            files = _.sortBy(files, ['filePath']);
            var coverageData = {
                count: (files.length > 0) ? Math.floor(totalProjectStatementDocumented / files.length) : 0,
                status: '',
                files: files
            };
            coverageData.status = getStatus(coverageData.count);
            _this.configuration.addPage({
                name: 'coverage',
                id: 'coverage',
                context: 'coverage',
                files: files,
                data: coverageData,
                depth: 0,
                pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
            });
            coverageData.files = files;
            _this.configuration.mainData.coverageData = coverageData;
            if (_this.configuration.mainData.exportFormat === defaults_1.COMPODOC_DEFAULTS.exportFormat) {
                _this.htmlEngine.generateCoverageBadge(_this.configuration.mainData.output, coverageData);
            }
            files = _.sortBy(files, ['coveragePercent']);
            var coverageTestPerFileResults;
            if (_this.configuration.mainData.coverageTest && !_this.configuration.mainData.coverageTestPerFile) {
                // Global coverage test and not per file
                if (coverageData.count >= _this.configuration.mainData.coverageTestThreshold) {
                    logger_1.logger.info("Documentation coverage (" + coverageData.count + "%) is over threshold");
                    generationPromiseResolve();
                    process.exit(0);
                }
                else {
                    logger_1.logger.error("Documentation coverage (" + coverageData.count + "%) is not over threshold");
                    generationPromiseReject();
                    process.exit(1);
                }
            }
            else if (!_this.configuration.mainData.coverageTest && _this.configuration.mainData.coverageTestPerFile) {
                coverageTestPerFileResults = processCoveragePerFile();
                // Per file coverage test and not global
                if (coverageTestPerFileResults.underFiles.length > 0) {
                    logger_1.logger.error('Documentation coverage per file is not achieved');
                    generationPromiseReject();
                    process.exit(1);
                }
                else {
                    logger_1.logger.info('Documentation coverage per file is achieved');
                    generationPromiseResolve();
                    process.exit(0);
                }
            }
            else if (_this.configuration.mainData.coverageTest && _this.configuration.mainData.coverageTestPerFile) {
                // Per file coverage test and global
                coverageTestPerFileResults = processCoveragePerFile();
                if (coverageData.count >= _this.configuration.mainData.coverageTestThreshold &&
                    coverageTestPerFileResults.underFiles.length === 0) {
                    logger_1.logger.info("Documentation coverage (" + coverageData.count + "%) is over threshold");
                    logger_1.logger.info('Documentation coverage per file is achieved');
                    generationPromiseResolve();
                    process.exit(0);
                }
                else if (coverageData.count >= _this.configuration.mainData.coverageTestThreshold &&
                    coverageTestPerFileResults.underFiles.length > 0) {
                    logger_1.logger.info("Documentation coverage (" + coverageData.count + "%) is over threshold");
                    logger_1.logger.error('Documentation coverage per file is not achieved');
                    generationPromiseReject();
                    process.exit(1);
                }
                else if (coverageData.count < _this.configuration.mainData.coverageTestThreshold &&
                    coverageTestPerFileResults.underFiles.length > 0) {
                    logger_1.logger.error("Documentation coverage (" + coverageData.count + "%) is not over threshold");
                    logger_1.logger.error('Documentation coverage per file is not achieved');
                    generationPromiseReject();
                    process.exit(1);
                }
                else {
                    logger_1.logger.error("Documentation coverage (" + coverageData.count + "%) is not over threshold");
                    logger_1.logger.info('Documentation coverage per file is achieved');
                    generationPromiseReject();
                    process.exit(1);
                }
            }
            else {
                resolve();
            }
        });
    };
    Application.prototype.processPage = function (page) {
        logger_1.logger.info('Process page', page.name);
        var htmlData = this.htmlEngine.render(this.configuration.mainData, page);
        var finalPath = this.configuration.mainData.output;
        if (this.configuration.mainData.output.lastIndexOf('/') === -1) {
            finalPath += '/';
        }
        if (page.path) {
            finalPath += page.path + '/';
        }
        if (page.filename) {
            finalPath += page.filename + '.html';
        }
        else {
            finalPath += page.name + '.html';
        }
        this.searchEngine.indexPage({
            infos: page,
            rawData: htmlData,
            url: finalPath
        });
        return this.fileEngine.write(finalPath, htmlData).catch(function (err) {
            logger_1.logger.error('Error during ' + page.name + ' page generation');
            return Promise.reject('');
        });
    };
    Application.prototype.processPages = function () {
        var _this = this;
        logger_1.logger.info('Process pages');
        var pages = this.configuration.pages;
        Promise.all(pages.map(function (page) { return _this.processPage(page); }))
            .then(function () {
            _this.searchEngine.generateSearchIndexJson(_this.configuration.mainData.output).then(function () {
                if (_this.configuration.mainData.additionalPages.length > 0) {
                    _this.processAdditionalPages();
                }
                else {
                    if (_this.configuration.mainData.assetsFolder !== '') {
                        _this.processAssetsFolder();
                    }
                    _this.processResources();
                }
            }, function (e) {
                logger_1.logger.error(e);
            });
        })
            .catch(function (e) {
            logger_1.logger.error(e);
        });
    };
    Application.prototype.processAdditionalPages = function () {
        var _this = this;
        logger_1.logger.info('Process additional pages');
        var pages = this.configuration.mainData.additionalPages;
        Promise.all(pages.map(function (page, i) { return _this.processPage(page); }))
            .then(function () {
            _this.searchEngine.generateSearchIndexJson(_this.configuration.mainData.output).then(function () {
                if (_this.configuration.mainData.assetsFolder !== '') {
                    _this.processAssetsFolder();
                }
                _this.processResources();
            });
        })
            .catch(function (e) {
            logger_1.logger.error(e);
            return Promise.reject(e);
        });
    };
    Application.prototype.processAssetsFolder = function () {
        logger_1.logger.info('Copy assets folder');
        if (!this.fileEngine.existsSync(this.configuration.mainData.assetsFolder)) {
            logger_1.logger.error("Provided assets folder " + this.configuration.mainData.assetsFolder + " did not exist");
        }
        else {
            fs.copy(path.resolve(this.configuration.mainData.assetsFolder), path.resolve(this.configuration.mainData.output + path.sep + this.configuration.mainData.assetsFolder), function (err) {
                if (err) {
                    logger_1.logger.error('Error during resources copy ', err);
                }
            });
        }
    };
    Application.prototype.processResources = function () {
        var _this = this;
        logger_1.logger.info('Copy main resources');
        var onComplete = function () {
            logger_1.logger.info('Documentation generated in ' + _this.configuration.mainData.output +
                ' in ' + _this.getElapsedTime() +
                ' seconds using ' + _this.configuration.mainData.theme + ' theme');
            if (_this.configuration.mainData.serve) {
                logger_1.logger.info("Serving documentation from " + _this.configuration.mainData.output + " at http://127.0.0.1:" + _this.configuration.mainData.port);
                _this.runWebServer(_this.configuration.mainData.output);
            }
            else {
                generationPromiseResolve();
                _this.endCallback();
            }
        };
        var finalOutput = this.configuration.mainData.output;
        var testOutputDir = this.configuration.mainData.output.match(process.cwd());
        if (!testOutputDir) {
            finalOutput = this.configuration.mainData.output.replace(process.cwd(), '');
        }
        fs.copy(path.resolve(__dirname + '/../src/resources/'), path.resolve(finalOutput), function (err) {
            if (err) {
                logger_1.logger.error('Error during resources copy ', err);
            }
            else {
                if (_this.configuration.mainData.extTheme) {
                    fs.copy(path.resolve(process.cwd() + path.sep + _this.configuration.mainData.extTheme), path.resolve(finalOutput + '/styles/'), function (err1) {
                        if (err1) {
                            logger_1.logger.error('Error during external styling theme copy ', err1);
                        }
                        else {
                            logger_1.logger.info('External styling theme copy succeeded');
                            onComplete();
                        }
                    });
                }
                else {
                    if (_this.configuration.mainData.customFavicon !== '') {
                        logger_1.logger.info("Custom favicon supplied");
                        fs.copy(path.resolve(process.cwd() + path.sep + _this.configuration.mainData.customFavicon), path.resolve(finalOutput + '/images/favicon.ico'), function (err) {
                            if (err) {
                                logger_1.logger.error('Error during resources copy ', err);
                            }
                            else {
                                onComplete();
                            }
                        });
                    }
                    else {
                        onComplete();
                    }
                }
            }
        });
    };
    /**
     * Calculates the elapsed time since the program was started.
     *
     * @returns {number}
     */
    Application.prototype.getElapsedTime = function () {
        return (new Date().valueOf() - startTime.valueOf()) / 1000;
    };
    Application.prototype.processGraphs = function () {
        var _this = this;
        if (this.configuration.mainData.disableGraph) {
            logger_1.logger.info('Graph generation disabled');
            this.processPages();
        }
        else {
            logger_1.logger.info('Process main graph');
            var modules_1 = this.configuration.mainData.modules;
            var i_1 = 0;
            var len_1 = modules_1.length;
            var loop_1 = function () {
                if (i_1 <= len_1 - 1) {
                    logger_1.logger.info('Process module graph', modules_1[i_1].name);
                    var finalPath_1 = _this.configuration.mainData.output;
                    if (_this.configuration.mainData.output.lastIndexOf('/') === -1) {
                        finalPath_1 += '/';
                    }
                    finalPath_1 += 'modules/' + modules_1[i_1].name;
                    var _rawModule = _this.dependenciesEngine.getRawModule(modules_1[i_1].name);
                    if (_rawModule.declarations.length > 0 ||
                        _rawModule.bootstrap.length > 0 ||
                        _rawModule.imports.length > 0 ||
                        _rawModule.exports.length > 0 ||
                        _rawModule.providers.length > 0) {
                        _this.ngdEngine.renderGraph(modules_1[i_1].file, finalPath_1, 'f', modules_1[i_1].name).then(function () {
                            _this.ngdEngine.readGraph(path.resolve(finalPath_1 + path.sep + 'dependencies.svg'), modules_1[i_1].name)
                                .then(function (data) {
                                modules_1[i_1].graph = data;
                                i_1++;
                                loop_1();
                            }, function (err) {
                                logger_1.logger.error('Error during graph read: ', err);
                            });
                        }, function (errorMessage) {
                            logger_1.logger.error(errorMessage);
                        });
                    }
                    else {
                        i_1++;
                        loop_1();
                    }
                }
                else {
                    _this.processPages();
                }
            };
            var finalMainGraphPath_1 = this.configuration.mainData.output;
            if (finalMainGraphPath_1.lastIndexOf('/') === -1) {
                finalMainGraphPath_1 += '/';
            }
            finalMainGraphPath_1 += 'graph';
            this.ngdEngine.init(path.resolve(finalMainGraphPath_1));
            this.ngdEngine.renderGraph(this.configuration.mainData.tsconfig, path.resolve(finalMainGraphPath_1), 'p').then(function () {
                _this.ngdEngine.readGraph(path.resolve(finalMainGraphPath_1 + path.sep + 'dependencies.svg'), 'Main graph').then(function (data) {
                    _this.configuration.mainData.mainGraph = data;
                    loop_1();
                }, function (err) {
                    logger_1.logger.error('Error during main graph reading : ', err);
                    _this.configuration.mainData.disableMainGraph = true;
                    loop_1();
                });
            }, function (err) {
                logger_1.logger.error('Ooops error during main graph generation, moving on next part with main graph disabled : ', err);
                _this.configuration.mainData.disableMainGraph = true;
                loop_1();
            });
        }
    };
    Application.prototype.runWebServer = function (folder) {
        if (!this.isWatching) {
            LiveServer.start({
                root: folder,
                open: this.configuration.mainData.open,
                quiet: true,
                logLevel: 0,
                wait: 1000,
                port: this.configuration.mainData.port
            });
        }
        if (this.configuration.mainData.watch && !this.isWatching) {
            if (typeof this.files === 'undefined') {
                logger_1.logger.error('No sources files available, please use -p flag');
                generationPromiseReject();
                process.exit(1);
            }
            else {
                this.runWatch();
            }
        }
        else if (this.configuration.mainData.watch && this.isWatching) {
            var srcFolder = utilities_1.findMainSourceFolder(this.files);
            logger_1.logger.info("Already watching sources in " + srcFolder + " folder");
        }
    };
    Application.prototype.runWatch = function () {
        var _this = this;
        var sources = [utilities_1.findMainSourceFolder(this.files)];
        var watcherReady = false;
        this.isWatching = true;
        logger_1.logger.info("Watching sources in " + utilities_1.findMainSourceFolder(this.files) + " folder");
        if ($markdownengine.hasRootMarkdowns()) {
            sources = sources.concat($markdownengine.listRootMarkdowns());
        }
        if (this.configuration.mainData.includes !== '') {
            sources = sources.concat(this.configuration.mainData.includes);
        }
        // Check all elements of sources list exist
        sources = utils_1.cleanSourcesForWatch(sources);
        var watcher = chokidar.watch(sources, {
            awaitWriteFinish: true,
            ignoreInitial: true,
            ignored: /(spec|\.d)\.ts/
        });
        var timerAddAndRemoveRef;
        var timerChangeRef;
        var waiterAddAndRemove = function () {
            clearTimeout(timerAddAndRemoveRef);
            timerAddAndRemoveRef = setTimeout(runnerAddAndRemove, 1000);
        };
        var runnerAddAndRemove = function () {
            startTime = new Date();
            _this.generate();
        };
        var waiterChange = function () {
            clearTimeout(timerChangeRef);
            timerChangeRef = setTimeout(runnerChange, 1000);
        };
        var runnerChange = function () {
            startTime = new Date();
            _this.setUpdatedFiles(_this.watchChangedFiles);
            if (_this.hasWatchedFilesTSFiles()) {
                _this.getMicroDependenciesData();
            }
            else if (_this.hasWatchedFilesRootMarkdownFiles()) {
                _this.rebuildRootMarkdowns();
            }
            else {
                _this.rebuildExternalDocumentation();
            }
        };
        watcher
            .on('ready', function () {
            if (!watcherReady) {
                watcherReady = true;
                watcher
                    .on('add', function (file) {
                    logger_1.logger.debug("File " + file + " has been added");
                    // Test extension, if ts
                    // rescan everything
                    if (path.extname(file) === '.ts') {
                        waiterAddAndRemove();
                    }
                })
                    .on('change', function (file) {
                    logger_1.logger.debug("File " + file + " has been changed");
                    // Test extension, if ts
                    // rescan only file
                    if (path.extname(file) === '.ts' || path.extname(file) === '.md' || path.extname(file) === '.json') {
                        _this.watchChangedFiles.push(path.join(process.cwd() + path.sep + file));
                        waiterChange();
                    }
                })
                    .on('unlink', function (file) {
                    logger_1.logger.debug("File " + file + " has been removed");
                    // Test extension, if ts
                    // rescan everything
                    if (path.extname(file) === '.ts') {
                        waiterAddAndRemove();
                    }
                });
            }
        });
    };
    Object.defineProperty(Application.prototype, "application", {
        /**
         * Return the application / root component instance.
         */
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "isCLI", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return Application;
}());
exports.Application = Application;
//# sourceMappingURL=application.js.map