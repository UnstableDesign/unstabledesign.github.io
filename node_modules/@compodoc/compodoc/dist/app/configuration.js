"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaults_1 = require("../utils/defaults");
var _ = require("lodash");
var Configuration = /** @class */ (function () {
    function Configuration() {
        this._pages = [];
        this._mainData = {
            output: defaults_1.COMPODOC_DEFAULTS.folder,
            theme: defaults_1.COMPODOC_DEFAULTS.theme,
            extTheme: '',
            serve: false,
            port: defaults_1.COMPODOC_DEFAULTS.port,
            open: false,
            assetsFolder: '',
            documentationMainName: defaults_1.COMPODOC_DEFAULTS.title,
            documentationMainDescription: '',
            base: defaults_1.COMPODOC_DEFAULTS.base,
            hideGenerator: false,
            modules: [],
            readme: false,
            changelog: '',
            contributing: '',
            license: '',
            todo: '',
            markdowns: [],
            additionalPages: [],
            pipes: [],
            classes: [],
            interfaces: [],
            components: [],
            directives: [],
            injectables: [],
            interceptors: [],
            miscellaneous: [],
            routes: [],
            tsconfig: '',
            toggleMenuItems: [],
            includes: '',
            includesName: defaults_1.COMPODOC_DEFAULTS.additionalEntryName,
            includesFolder: defaults_1.COMPODOC_DEFAULTS.additionalEntryPath,
            disableSourceCode: defaults_1.COMPODOC_DEFAULTS.disableSourceCode,
            disableGraph: defaults_1.COMPODOC_DEFAULTS.disableGraph,
            disableMainGraph: defaults_1.COMPODOC_DEFAULTS.disableMainGraph,
            disableCoverage: defaults_1.COMPODOC_DEFAULTS.disableCoverage,
            disablePrivate: defaults_1.COMPODOC_DEFAULTS.disablePrivate,
            disableInternal: defaults_1.COMPODOC_DEFAULTS.disableInternal,
            disableProtected: defaults_1.COMPODOC_DEFAULTS.disableProtected,
            disableLifeCycleHooks: defaults_1.COMPODOC_DEFAULTS.disableLifeCycleHooks,
            watch: false,
            mainGraph: '',
            coverageTest: false,
            coverageTestThreshold: defaults_1.COMPODOC_DEFAULTS.defaultCoverageThreshold,
            coverageTestPerFile: false,
            coverageMinimumPerFile: defaults_1.COMPODOC_DEFAULTS.defaultCoverageMinimumPerFile,
            routesLength: 0,
            angularVersion: '',
            exportFormat: defaults_1.COMPODOC_DEFAULTS.exportFormat,
            coverageData: {},
            customFavicon: ''
        };
    }
    Configuration.prototype.addPage = function (page) {
        var indexPage = _.findIndex(this._pages, { 'name': page.name });
        if (indexPage === -1) {
            this._pages.push(page);
        }
    };
    Configuration.prototype.addAdditionalPage = function (page) {
        this._mainData.additionalPages.push(page);
    };
    Configuration.prototype.resetPages = function () {
        this._pages = [];
    };
    Configuration.prototype.resetAdditionalPages = function () {
        this._mainData.additionalPages = [];
    };
    Configuration.prototype.resetRootMarkdownPages = function () {
        var indexPage = _.findIndex(this._pages, { 'name': 'index' });
        this._pages.splice(indexPage, 1);
        indexPage = _.findIndex(this._pages, { 'name': 'changelog' });
        this._pages.splice(indexPage, 1);
        indexPage = _.findIndex(this._pages, { 'name': 'contributing' });
        this._pages.splice(indexPage, 1);
        indexPage = _.findIndex(this._pages, { 'name': 'license' });
        this._pages.splice(indexPage, 1);
        indexPage = _.findIndex(this._pages, { 'name': 'todo' });
        this._pages.splice(indexPage, 1);
        this._mainData.markdowns = [];
    };
    Object.defineProperty(Configuration.prototype, "pages", {
        get: function () {
            return this._pages;
        },
        set: function (pages) {
            this._pages = [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "mainData", {
        get: function () {
            return this._mainData;
        },
        set: function (data) {
            Object.assign(this._mainData, data);
        },
        enumerable: true,
        configurable: true
    });
    return Configuration;
}());
exports.Configuration = Configuration;
//# sourceMappingURL=configuration.js.map