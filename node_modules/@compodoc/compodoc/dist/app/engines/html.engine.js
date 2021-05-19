"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var Handlebars = require("handlebars");
var logger_1 = require("../../logger");
var html_engine_helpers_1 = require("./html.engine.helpers");
var file_engine_1 = require("./file.engine");
var HtmlEngine = /** @class */ (function () {
    function HtmlEngine(configuration, dependenciesEngine, fileEngine) {
        if (fileEngine === void 0) { fileEngine = new file_engine_1.FileEngine(); }
        this.fileEngine = fileEngine;
        this.cache = {};
        var helper = new html_engine_helpers_1.HtmlEngineHelpers();
        helper.registerHelpers(Handlebars, configuration, dependenciesEngine);
    }
    HtmlEngine.prototype.init = function () {
        var _this = this;
        var partials = [
            'menu',
            'overview',
            'markdown',
            'modules',
            'module',
            'components',
            'component',
            'component-detail',
            'directives',
            'directive',
            'injectables',
            'injectable',
            'interceptor',
            'pipes',
            'pipe',
            'classes',
            'class',
            'interface',
            'routes',
            'index',
            'index-directive',
            'index-misc',
            'search-results',
            'search-input',
            'link-type',
            'block-method',
            'block-enum',
            'block-property',
            'block-index',
            'block-constructor',
            'block-typealias',
            'block-accessors',
            'coverage-report',
            'miscellaneous-functions',
            'miscellaneous-variables',
            'miscellaneous-typealiases',
            'miscellaneous-enumerations',
            'additional-page'
        ];
        return Promise
            .all(partials.map(function (partial) {
            return _this.fileEngine
                .get(path.resolve(__dirname + '/../src/templates/partials/' + partial + '.hbs'))
                .then(function (data) { return Handlebars.registerPartial(partial, data); });
        })).then(function () {
            return _this.fileEngine
                .get(path.resolve(__dirname + '/../src/templates/page.hbs'))
                .then(function (data) { return _this.cache.page = data; });
        }).then(function () { });
    };
    HtmlEngine.prototype.render = function (mainData, page) {
        var o = mainData;
        Object.assign(o, page);
        var template = Handlebars.compile(this.cache.page);
        return template({
            data: o
        });
    };
    HtmlEngine.prototype.generateCoverageBadge = function (outputFolder, coverageData) {
        var _this = this;
        return this.fileEngine.get(path.resolve(__dirname + '/../src/templates/partials/coverage-badge.hbs'))
            .then(function (data) {
            var template = Handlebars.compile(data);
            var result = template({
                data: coverageData
            });
            var testOutputDir = outputFolder.match(process.cwd());
            if (!testOutputDir) {
                outputFolder = outputFolder.replace(process.cwd(), '');
            }
            return _this.fileEngine
                .write(outputFolder + path.sep + '/images/coverage-badge.svg', result)
                .catch(function (err) {
                logger_1.logger.error('Error during coverage badge file generation ', err);
                return Promise.reject(err);
            });
        }, function (err) { return Promise.reject('Error during coverage badge generation'); });
    };
    return HtmlEngine;
}());
exports.HtmlEngine = HtmlEngine;
//# sourceMappingURL=html.engine.js.map