'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var application = require('./application-54cd2170.js');
var fs = require('fs-extra');
var path = require('path');
var Ast = require('ts-simple-ast');
var Ast__default = _interopDefault(Ast);
require('live-server');
require('lodash');
require('i18next');
require('handlebars');
require('semver');
require('json5');

var glob = require('glob');
var ParserUtil = /** @class */ (function () {
    function ParserUtil() {
        this._globFiles = [];
    }
    ParserUtil.prototype.init = function (exclude, cwd) {
        this._files = exclude;
        this._cwd = cwd;
        var i = 0;
        var len = exclude.length;
        for (i; i < len; i++) {
            this._globFiles = this._globFiles.concat(glob.sync(exclude[i], { cwd: this._cwd }));
        }
    };
    ParserUtil.prototype.testFilesWithCwdDepth = function () {
        var i = 0;
        var len = this._files.length;
        var result = {
            status: true,
            level: 0
        };
        for (i; i < len; i++) {
            var elementPath = path.resolve(this._cwd + path.sep, this._files[i]);
            if (elementPath.indexOf(this._cwd) === -1) {
                result.status = false;
                var level = this._files[i].match(/\..\//g).length;
                if (level > result.level) {
                    result.level = level;
                }
            }
        }
        return result;
    };
    ParserUtil.prototype.updateCwd = function (cwd, level) {
        var _cwd = cwd, _rewind = '';
        for (var i = 0; i < level; i++) {
            _rewind += '../';
        }
        _cwd = path.resolve(_cwd, _rewind);
        return _cwd;
    };
    ParserUtil.prototype.testFile = function (file) {
        var _this = this;
        var i = 0;
        var len = this._files.length;
        var fileBasename = path.basename(file);
        var fileNameInCwd = file.replace(this._cwd + path.sep, '');
        var result = false;
        if (path.sep === '\\') {
            fileNameInCwd = fileNameInCwd.replace(new RegExp('\\' + path.sep, 'g'), '/');
        }
        for (i; i < len; i++) {
            if (glob.hasMagic(this._files[i]) && this._globFiles.length > 0) {
                var resultGlobSearch = this._globFiles.findIndex(function (element) {
                    var elementPath = path.resolve(_this._cwd + path.sep, element);
                    var elementPathInCwd = elementPath.replace(_this._cwd + path.sep, '');
                    elementPathInCwd = elementPathInCwd.replace(new RegExp('\\' + path.sep, 'g'), '/');
                    return elementPathInCwd === fileNameInCwd;
                });
                result = resultGlobSearch !== -1;
            }
            else {
                result = fileNameInCwd === this._files[i];
            }
            if (result) {
                break;
            }
        }
        return result;
    };
    return ParserUtil;
}());

var cosmiconfig = require('cosmiconfig');
var os = require('os');
var osName = require('os-name');
var pkg = require('../package.json');
var program = require('commander');
var cosmiconfigModuleName = 'compodoc';
var scannedFiles = [];
var excludeFiles;
var includeFiles;
var cwd = process.cwd();
process.setMaxListeners(0);
var CliApplication = /** @class */ (function (_super) {
    application.__extends(CliApplication, _super);
    function CliApplication() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Run compodoc from the command line.
     */
    CliApplication.prototype.start = function () {
        var _this = this;
        function list(val) {
            return val.split(',');
        }
        program
            .version(pkg.version)
            .usage('<src> [options]')
            .option('-c, --config [config]', 'A configuration file : .compodocrc, .compodocrc.json, .compodocrc.yaml or compodoc property in package.json')
            .option('-p, --tsconfig [config]', 'A tsconfig.json file')
            .option('-d, --output [folder]', 'Where to store the generated documentation', application.COMPODOC_DEFAULTS.folder)
            .option('-y, --extTheme [file]', 'External styling theme file')
            .option('-n, --name [name]', 'Title documentation', application.COMPODOC_DEFAULTS.title)
            .option('-a, --assetsFolder [folder]', 'External assets folder to copy in generated documentation folder')
            .option('-o, --open [value]', 'Open the generated documentation')
            .option('-t, --silent', "In silent mode, log messages aren't logged in the console", false)
            .option('-s, --serve', 'Serve generated documentation (default http://localhost:8080/)', false)
            .option('--host [host]', 'Change default host address')
            .option('-r, --port [port]', 'Change default serving port', application.COMPODOC_DEFAULTS.port)
            .option('-w, --watch', 'Watch source files after serve and force documentation rebuild', false)
            .option('-e, --exportFormat [format]', 'Export in specified format (json, html)', application.COMPODOC_DEFAULTS.exportFormat)
            .option('--files [files]', 'Files provided by external tool, used for coverage test')
            .option('--language [language]', 'Language used for the generated documentation (de-DE, en-US, es-ES, fr-FR, hu-HU, it-IT, ja-JP, nl-NL, pt-BR, sk-SK, zh-CN)', application.COMPODOC_DEFAULTS.language)
            .option('--theme [theme]', "Choose one of available themes, default is 'gitbook' (laravel, original, material, postmark, readthedocs, stripe, vagrant)")
            .option('--hideGenerator', 'Do not print the Compodoc link at the bottom of the page', false)
            .option('--toggleMenuItems <items>', "Close by default items in the menu values : ['all'] or one of these ['modules','components','directives','controllers','classes','injectables','guards','interfaces','interceptors','pipes','miscellaneous','additionalPages']", list, application.COMPODOC_DEFAULTS.toggleMenuItems)
            .option('--navTabConfig <tab configs>', "List navigation tab objects in the desired order with two string properties (\"id\" and \"label\"). Double-quotes must be escaped with '\\'. Available tab IDs are \"info\", \"readme\", \"source\", \"templateData\", \"styleData\", \"tree\", and \"example\". Note: Certain tabs will only be shown if applicable to a given dependency", list, JSON.stringify(application.COMPODOC_DEFAULTS.navTabConfig))
            .option('--templates [folder]', 'Path to directory of Handlebars templates to override built-in templates')
            .option('--includes [path]', 'Path of external markdown files to include')
            .option('--includesName [name]', 'Name of item menu of externals markdown files', application.COMPODOC_DEFAULTS.additionalEntryName)
            .option('--coverageTest [threshold]', 'Test command of documentation coverage with a threshold (default 70)')
            .option('--coverageMinimumPerFile [minimum]', 'Test command of documentation coverage per file with a minimum (default 0)')
            .option('--coverageTestThresholdFail [true|false]', 'Test command of documentation coverage (global or per file) will fail with error or just warn user (true: error, false: warn)', application.COMPODOC_DEFAULTS.coverageTestThresholdFail)
            .option('--coverageTestShowOnlyFailed', 'Display only failed files for a coverage test')
            .option('--unitTestCoverage [json-summary]', 'To include unit test coverage, specify istanbul JSON coverage summary file')
            .option('--disableSourceCode', 'Do not add source code tab and links to source code', false)
            .option('--disableDomTree', 'Do not add dom tree tab', false)
            .option('--disableTemplateTab', 'Do not add template tab', false)
            .option('--disableStyleTab', 'Do not add style tab', false)
            .option('--disableGraph', 'Do not add the dependency graph', false)
            .option('--disableCoverage', 'Do not add the documentation coverage report', false)
            .option('--disablePrivate', 'Do not show private in generated documentation', false)
            .option('--disableProtected', 'Do not show protected in generated documentation', false)
            .option('--disableInternal', 'Do not show @internal in generated documentation', false)
            .option('--disableLifeCycleHooks', 'Do not show Angular lifecycle hooks in generated documentation', false)
            .option('--disableRoutesGraph', 'Do not add the routes graph', application.COMPODOC_DEFAULTS.disableRoutesGraph)
            .option('--disableSearch', 'Do not add the search input', false)
            .option('--disableDependencies', 'Do not add the dependencies list', application.COMPODOC_DEFAULTS.disableDependencies)
            .option('--minimal', 'Minimal mode with only documentation. No search, no graph, no coverage.', false)
            .option('--customFavicon [path]', 'Use a custom favicon')
            .option('--customLogo [path]', 'Use a custom logo')
            .option('--gaID [id]', 'Google Analytics tracking ID')
            .option('--gaSite [site]', 'Google Analytics site name', application.COMPODOC_DEFAULTS.gaSite)
            .option('--maxSearchResults [maxSearchResults]', 'Max search results on the results page. To show all results, set to 0', application.COMPODOC_DEFAULTS.maxSearchResults)
            .parse(process.argv);
        var outputHelp = function () {
            program.outputHelp();
            process.exit(1);
        };
        var configExplorer = cosmiconfig(cosmiconfigModuleName);
        var configExplorerResult;
        var configFile = {};
        if (program.config) {
            var configFilePath = program.config;
            var testConfigFilePath = configFilePath.match(process.cwd());
            if (testConfigFilePath && testConfigFilePath.length > 0) {
                configFilePath = configFilePath.replace(process.cwd() + path.sep, '');
            }
            configExplorerResult = configExplorer.loadSync(path.resolve(configFilePath));
        }
        else {
            configExplorerResult = configExplorer.searchSync();
        }
        if (configExplorerResult) {
            if (typeof configExplorerResult.config !== 'undefined') {
                configFile = configExplorerResult.config;
            }
        }
        if (configFile.output) {
            application.Configuration.mainData.output = configFile.output;
        }
        if (program.output && program.output !== application.COMPODOC_DEFAULTS.folder) {
            application.Configuration.mainData.output = program.output;
        }
        if (configFile.extTheme) {
            application.Configuration.mainData.extTheme = configFile.extTheme;
        }
        if (program.extTheme) {
            application.Configuration.mainData.extTheme = program.extTheme;
        }
        if (configFile.language) {
            application.Configuration.mainData.language = configFile.language;
        }
        if (program.language) {
            application.Configuration.mainData.language = program.language;
        }
        if (configFile.theme) {
            application.Configuration.mainData.theme = configFile.theme;
        }
        if (program.theme) {
            application.Configuration.mainData.theme = program.theme;
        }
        if (configFile.name) {
            application.Configuration.mainData.documentationMainName = configFile.name;
        }
        if (program.name && program.name !== application.COMPODOC_DEFAULTS.title) {
            application.Configuration.mainData.documentationMainName = program.name;
        }
        if (configFile.assetsFolder) {
            application.Configuration.mainData.assetsFolder = configFile.assetsFolder;
        }
        if (program.assetsFolder) {
            application.Configuration.mainData.assetsFolder = program.assetsFolder;
        }
        if (configFile.open) {
            application.Configuration.mainData.open = configFile.open;
        }
        if (program.open) {
            application.Configuration.mainData.open = program.open;
        }
        if (configFile.toggleMenuItems) {
            application.Configuration.mainData.toggleMenuItems = configFile.toggleMenuItems;
        }
        if (program.toggleMenuItems &&
            program.toggleMenuItems !== application.COMPODOC_DEFAULTS.toggleMenuItems) {
            application.Configuration.mainData.toggleMenuItems = program.toggleMenuItems;
        }
        if (configFile.templates) {
            application.Configuration.mainData.templates = configFile.templates;
        }
        if (program.templates) {
            application.Configuration.mainData.templates = program.templates;
        }
        if (configFile.navTabConfig) {
            application.Configuration.mainData.navTabConfig = configFile.navTabConfig;
        }
        if (program.navTabConfig &&
            JSON.parse(program.navTabConfig).length !== application.COMPODOC_DEFAULTS.navTabConfig.length) {
            application.Configuration.mainData.navTabConfig = JSON.parse(program.navTabConfig);
        }
        if (configFile.includes) {
            application.Configuration.mainData.includes = configFile.includes;
        }
        if (program.includes) {
            application.Configuration.mainData.includes = program.includes;
        }
        if (configFile.includesName) {
            application.Configuration.mainData.includesName = configFile.includesName;
        }
        if (program.includesName &&
            program.includesName !== application.COMPODOC_DEFAULTS.additionalEntryName) {
            application.Configuration.mainData.includesName = program.includesName;
        }
        if (configFile.silent) {
            application.logger.silent = false;
        }
        if (program.silent) {
            application.logger.silent = false;
        }
        if (configFile.serve) {
            application.Configuration.mainData.serve = configFile.serve;
        }
        if (program.serve) {
            application.Configuration.mainData.serve = program.serve;
        }
        if (configFile.host) {
            application.Configuration.mainData.host = configFile.host;
            application.Configuration.mainData.hostname = configFile.host;
        }
        if (program.host) {
            application.Configuration.mainData.host = program.host;
            application.Configuration.mainData.hostname = program.host;
        }
        if (configFile.port) {
            application.Configuration.mainData.port = configFile.port;
        }
        if (program.port && program.port !== application.COMPODOC_DEFAULTS.port) {
            application.Configuration.mainData.port = program.port;
        }
        if (configFile.watch) {
            application.Configuration.mainData.watch = configFile.watch;
        }
        if (program.watch) {
            application.Configuration.mainData.watch = program.watch;
        }
        if (configFile.exportFormat) {
            application.Configuration.mainData.exportFormat = configFile.exportFormat;
        }
        if (program.exportFormat && program.exportFormat !== application.COMPODOC_DEFAULTS.exportFormat) {
            application.Configuration.mainData.exportFormat = program.exportFormat;
        }
        if (configFile.hideGenerator) {
            application.Configuration.mainData.hideGenerator = configFile.hideGenerator;
        }
        if (program.hideGenerator) {
            application.Configuration.mainData.hideGenerator = program.hideGenerator;
        }
        if (configFile.coverageTest) {
            application.Configuration.mainData.coverageTest = true;
            application.Configuration.mainData.coverageTestThreshold =
                typeof configFile.coverageTest === 'string'
                    ? parseInt(configFile.coverageTest, 10)
                    : application.COMPODOC_DEFAULTS.defaultCoverageThreshold;
        }
        if (program.coverageTest) {
            application.Configuration.mainData.coverageTest = true;
            application.Configuration.mainData.coverageTestThreshold =
                typeof program.coverageTest === 'string'
                    ? parseInt(program.coverageTest, 10)
                    : application.COMPODOC_DEFAULTS.defaultCoverageThreshold;
        }
        if (configFile.coverageMinimumPerFile) {
            application.Configuration.mainData.coverageTestPerFile = true;
            application.Configuration.mainData.coverageMinimumPerFile =
                typeof configFile.coverageMinimumPerFile === 'string'
                    ? parseInt(configFile.coverageMinimumPerFile, 10)
                    : application.COMPODOC_DEFAULTS.defaultCoverageMinimumPerFile;
        }
        if (program.coverageMinimumPerFile) {
            application.Configuration.mainData.coverageTestPerFile = true;
            application.Configuration.mainData.coverageMinimumPerFile =
                typeof program.coverageMinimumPerFile === 'string'
                    ? parseInt(program.coverageMinimumPerFile, 10)
                    : application.COMPODOC_DEFAULTS.defaultCoverageMinimumPerFile;
        }
        if (configFile.coverageTestThresholdFail) {
            application.Configuration.mainData.coverageTestThresholdFail =
                configFile.coverageTestThresholdFail === 'false' ? false : true;
        }
        if (program.coverageTestThresholdFail) {
            application.Configuration.mainData.coverageTestThresholdFail =
                program.coverageTestThresholdFail === 'false' ? false : true;
        }
        if (configFile.coverageTestShowOnlyFailed) {
            application.Configuration.mainData.coverageTestShowOnlyFailed =
                configFile.coverageTestShowOnlyFailed;
        }
        if (program.coverageTestShowOnlyFailed) {
            application.Configuration.mainData.coverageTestShowOnlyFailed = program.coverageTestShowOnlyFailed;
        }
        if (configFile.unitTestCoverage) {
            application.Configuration.mainData.unitTestCoverage = configFile.unitTestCoverage;
        }
        if (program.unitTestCoverage) {
            application.Configuration.mainData.unitTestCoverage = program.unitTestCoverage;
        }
        if (configFile.disableSourceCode) {
            application.Configuration.mainData.disableSourceCode = configFile.disableSourceCode;
        }
        if (program.disableSourceCode) {
            application.Configuration.mainData.disableSourceCode = program.disableSourceCode;
        }
        if (configFile.disableDomTree) {
            application.Configuration.mainData.disableDomTree = configFile.disableDomTree;
        }
        if (program.disableDomTree) {
            application.Configuration.mainData.disableDomTree = program.disableDomTree;
        }
        if (configFile.disableTemplateTab) {
            application.Configuration.mainData.disableTemplateTab = configFile.disableTemplateTab;
        }
        if (program.disableTemplateTab) {
            application.Configuration.mainData.disableTemplateTab = program.disableTemplateTab;
        }
        if (configFile.disableStyleTab) {
            application.Configuration.mainData.disableStyleTab = configFile.disableStyleTab;
        }
        if (program.disableStyleTab) {
            application.Configuration.mainData.disableStyleTab = program.disableStyleTab;
        }
        if (configFile.disableGraph) {
            application.Configuration.mainData.disableGraph = configFile.disableGraph;
        }
        if (program.disableGraph) {
            application.Configuration.mainData.disableGraph = program.disableGraph;
        }
        if (configFile.disableCoverage) {
            application.Configuration.mainData.disableCoverage = configFile.disableCoverage;
        }
        if (program.disableCoverage) {
            application.Configuration.mainData.disableCoverage = program.disableCoverage;
        }
        if (configFile.disablePrivate) {
            application.Configuration.mainData.disablePrivate = configFile.disablePrivate;
        }
        if (program.disablePrivate) {
            application.Configuration.mainData.disablePrivate = program.disablePrivate;
        }
        if (configFile.disableProtected) {
            application.Configuration.mainData.disableProtected = configFile.disableProtected;
        }
        if (program.disableProtected) {
            application.Configuration.mainData.disableProtected = program.disableProtected;
        }
        if (configFile.disableInternal) {
            application.Configuration.mainData.disableInternal = configFile.disableInternal;
        }
        if (program.disableInternal) {
            application.Configuration.mainData.disableInternal = program.disableInternal;
        }
        if (configFile.disableLifeCycleHooks) {
            application.Configuration.mainData.disableLifeCycleHooks = configFile.disableLifeCycleHooks;
        }
        if (program.disableLifeCycleHooks) {
            application.Configuration.mainData.disableLifeCycleHooks = program.disableLifeCycleHooks;
        }
        if (configFile.disableRoutesGraph) {
            application.Configuration.mainData.disableRoutesGraph = configFile.disableRoutesGraph;
        }
        if (program.disableRoutesGraph) {
            application.Configuration.mainData.disableRoutesGraph = program.disableRoutesGraph;
        }
        if (configFile.disableSearch) {
            application.Configuration.mainData.disableSearch = configFile.disableSearch;
        }
        if (program.disableSearch) {
            application.Configuration.mainData.disableSearch = program.disableSearch;
        }
        if (configFile.disableDependencies) {
            application.Configuration.mainData.disableDependencies = configFile.disableDependencies;
        }
        if (program.disableDependencies) {
            application.Configuration.mainData.disableDependencies = program.disableDependencies;
        }
        if (configFile.minimal) {
            application.Configuration.mainData.disableSearch = true;
            application.Configuration.mainData.disableRoutesGraph = true;
            application.Configuration.mainData.disableGraph = true;
            application.Configuration.mainData.disableCoverage = true;
        }
        if (program.minimal) {
            application.Configuration.mainData.disableSearch = true;
            application.Configuration.mainData.disableRoutesGraph = true;
            application.Configuration.mainData.disableGraph = true;
            application.Configuration.mainData.disableCoverage = true;
        }
        if (configFile.customFavicon) {
            application.Configuration.mainData.customFavicon = configFile.customFavicon;
        }
        if (program.customFavicon) {
            application.Configuration.mainData.customFavicon = program.customFavicon;
        }
        if (configFile.customLogo) {
            application.Configuration.mainData.customLogo = configFile.customLogo;
        }
        if (program.customLogo) {
            application.Configuration.mainData.customLogo = program.customLogo;
        }
        if (configFile.gaID) {
            application.Configuration.mainData.gaID = configFile.gaID;
        }
        if (program.gaID) {
            application.Configuration.mainData.gaID = program.gaID;
        }
        if (configFile.gaSite) {
            application.Configuration.mainData.gaSite = configFile.gaSite;
        }
        if (program.gaSite && program.gaSite !== application.COMPODOC_DEFAULTS.gaSite) {
            application.Configuration.mainData.gaSite = program.gaSite;
        }
        if (!this.isWatching) {
            if (!application.logger.silent) {
                console.log("Compodoc v" + pkg.version);
            }
            else {
                console.log(fs.readFileSync(path.join(__dirname, '../src/banner')).toString());
                console.log(pkg.version);
                console.log('');
                console.log("TypeScript version used by Compodoc : " + Ast.ts.version);
                console.log('');
                if (application.FileEngine.existsSync(cwd + path.sep + 'package.json')) {
                    var packageData = application.FileEngine.getSync(cwd + path.sep + 'package.json');
                    if (packageData) {
                        var parsedData = JSON.parse(packageData);
                        var projectDevDependencies = parsedData.devDependencies;
                        if (projectDevDependencies && projectDevDependencies.typescript) {
                            var tsProjectVersion = application.AngularVersionUtil.cleanVersion(projectDevDependencies.typescript);
                            console.log("TypeScript version of current project : " + tsProjectVersion);
                            console.log('');
                        }
                    }
                }
                console.log("Node.js version : " + process.version);
                console.log('');
                console.log("Operating system : " + osName(os.platform(), os.release()));
                console.log('');
            }
        }
        if (configExplorerResult) {
            if (typeof configExplorerResult.config !== 'undefined') {
                application.logger.info("Using configuration file : " + configExplorerResult.filepath);
            }
        }
        if (!configExplorerResult) {
            application.logger.warn("No configuration file found, switching to CLI flags.");
        }
        if (program.language && !application.I18nEngine.supportLanguage(program.language)) {
            application.logger.warn("The language " + program.language + " is not available, falling back to " + application.I18nEngine.fallbackLanguage);
        }
        if (program.tsconfig && typeof program.tsconfig === 'boolean') {
            application.logger.error("Please provide a tsconfig file.");
            process.exit(1);
        }
        if (configFile.tsconfig) {
            application.Configuration.mainData.tsconfig = configFile.tsconfig;
        }
        if (program.tsconfig) {
            application.Configuration.mainData.tsconfig = program.tsconfig;
        }
        if (program.maxSearchResults) {
            application.Configuration.mainData.maxSearchResults = program.maxSearchResults;
        }
        if (configFile.files) {
            scannedFiles = configFile.files;
        }
        if (configFile.exclude) {
            excludeFiles = configFile.exclude;
        }
        if (configFile.include) {
            includeFiles = configFile.include;
        }
        /**
         * Check --files argument call
         */
        var argv = require('minimist')(process.argv.slice(2));
        if (argv && argv.files) {
            application.Configuration.mainData.hasFilesToCoverage = true;
            if (typeof argv.files === 'string') {
                _super.prototype.setFiles.call(this, [argv.files]);
            }
            else {
                _super.prototype.setFiles.call(this, argv.files);
            }
        }
        if (program.serve && !application.Configuration.mainData.tsconfig && program.output) {
            // if -s & -d, serve it
            if (!application.FileEngine.existsSync(application.Configuration.mainData.output)) {
                application.logger.error(application.Configuration.mainData.output + " folder doesn't exist");
                process.exit(1);
            }
            else {
                application.logger.info("Serving documentation from " + application.Configuration.mainData.output + " at http://" + application.Configuration.mainData.hostname + ":" + program.port);
                _super.prototype.runWebServer.call(this, application.Configuration.mainData.output);
            }
        }
        else if (program.serve && !application.Configuration.mainData.tsconfig && !program.output) {
            // if only -s find ./documentation, if ok serve, else error provide -d
            if (!application.FileEngine.existsSync(application.Configuration.mainData.output)) {
                application.logger.error('Provide output generated folder with -d flag');
                process.exit(1);
            }
            else {
                application.logger.info("Serving documentation from " + application.Configuration.mainData.output + " at http://" + application.Configuration.mainData.hostname + ":" + program.port);
                _super.prototype.runWebServer.call(this, application.Configuration.mainData.output);
            }
        }
        else if (application.Configuration.mainData.hasFilesToCoverage) {
            if (program.coverageMinimumPerFile) {
                application.logger.info('Run documentation coverage test for files');
                _super.prototype.testCoverage.call(this);
            }
            else {
                application.logger.error('Missing coverage configuration');
            }
        }
        else {
            if (program.hideGenerator) {
                application.Configuration.mainData.hideGenerator = true;
            }
            if (application.Configuration.mainData.tsconfig && program.args.length === 0) {
                /**
                 * tsconfig file provided only
                 */
                var testTsConfigPath = application.Configuration.mainData.tsconfig.indexOf(process.cwd());
                if (testTsConfigPath !== -1) {
                    application.Configuration.mainData.tsconfig = application.Configuration.mainData.tsconfig.replace(process.cwd() + path.sep, '');
                }
                if (!application.FileEngine.existsSync(application.Configuration.mainData.tsconfig)) {
                    application.logger.error("\"" + application.Configuration.mainData.tsconfig + "\" file was not found in the current directory");
                    process.exit(1);
                }
                else {
                    var _file = path.join(path.join(process.cwd(), path.dirname(application.Configuration.mainData.tsconfig)), path.basename(application.Configuration.mainData.tsconfig));
                    // use the current directory of tsconfig.json as a working directory
                    cwd = _file
                        .split(path.sep)
                        .slice(0, -1)
                        .join(path.sep);
                    application.logger.info('Using tsconfig file ', _file);
                    var tsConfigFile = application.readConfig(_file);
                    scannedFiles = tsConfigFile.files;
                    if (scannedFiles) {
                        scannedFiles = application.handlePath(scannedFiles, cwd);
                    }
                    if (typeof scannedFiles === 'undefined') {
                        excludeFiles = tsConfigFile.exclude || [];
                        includeFiles = tsConfigFile.include || [];
                        scannedFiles = [];
                        var excludeParser_1 = new ParserUtil(), includeParser_1 = new ParserUtil();
                        excludeParser_1.init(excludeFiles, cwd);
                        includeParser_1.init(includeFiles, cwd);
                        var startCwd = cwd;
                        var excludeParserTestFilesWithCwdDepth = excludeParser_1.testFilesWithCwdDepth();
                        if (!excludeParserTestFilesWithCwdDepth.status) {
                            startCwd = excludeParser_1.updateCwd(cwd, excludeParserTestFilesWithCwdDepth.level);
                        }
                        var includeParserTestFilesWithCwdDepth = includeParser_1.testFilesWithCwdDepth();
                        if (!includeParser_1.testFilesWithCwdDepth().status) {
                            startCwd = includeParser_1.updateCwd(cwd, includeParserTestFilesWithCwdDepth.level);
                        }
                        var finder = require('findit2')(startCwd || '.');
                        finder.on('directory', function (dir, stat, stop) {
                            var base = path.basename(dir);
                            if (base === '.git' || base === 'node_modules') {
                                stop();
                            }
                        });
                        finder.on('file', function (file, stat) {
                            if (/(spec|\.d)\.ts/.test(file)) {
                                application.logger.warn('Ignoring', file);
                            }
                            else if (excludeParser_1.testFile(file) &&
                                path.extname(file) === '.ts') {
                                application.logger.warn('Excluding', file);
                            }
                            else if (includeFiles.length > 0) {
                                /**
                                 * If include provided in tsconfig, use only this source,
                                 * and not files found with global findit scan in working directory
                                 */
                                if (path.extname(file) === '.ts' && includeParser_1.testFile(file)) {
                                    application.logger.debug('Including', file);
                                    scannedFiles.push(file);
                                }
                                else {
                                    if (path.extname(file) === '.ts') {
                                        application.logger.warn('Excluding', file);
                                    }
                                }
                            }
                            else {
                                application.logger.debug('Including', file);
                                scannedFiles.push(file);
                            }
                        });
                        finder.on('end', function () {
                            _super.prototype.setFiles.call(_this, scannedFiles);
                            if (program.coverageTest || program.coverageTestPerFile) {
                                application.logger.info('Run documentation coverage test');
                                _super.prototype.testCoverage.call(_this);
                            }
                            else {
                                _super.prototype.generate.call(_this);
                            }
                        });
                    }
                    else {
                        _super.prototype.setFiles.call(this, scannedFiles);
                        if (program.coverageTest || program.coverageTestPerFile) {
                            application.logger.info('Run documentation coverage test');
                            _super.prototype.testCoverage.call(this);
                        }
                        else {
                            _super.prototype.generate.call(this);
                        }
                    }
                }
            }
            else if (application.Configuration.mainData.tsconfig && program.args.length > 0) {
                /**
                 * tsconfig file provided with source folder in arg
                 */
                var testTsConfigPath = application.Configuration.mainData.tsconfig.indexOf(process.cwd());
                if (testTsConfigPath !== -1) {
                    application.Configuration.mainData.tsconfig = application.Configuration.mainData.tsconfig.replace(process.cwd() + path.sep, '');
                }
                var sourceFolder = program.args[0];
                if (!application.FileEngine.existsSync(sourceFolder)) {
                    application.logger.error("Provided source folder " + sourceFolder + " was not found in the current directory");
                    process.exit(1);
                }
                else {
                    application.logger.info('Using provided source folder');
                    if (!application.FileEngine.existsSync(application.Configuration.mainData.tsconfig)) {
                        application.logger.error("\"" + application.Configuration.mainData.tsconfig + "\" file was not found in the current directory");
                        process.exit(1);
                    }
                    else {
                        var _file = path.join(path.join(process.cwd(), path.dirname(application.Configuration.mainData.tsconfig)), path.basename(application.Configuration.mainData.tsconfig));
                        // use the current directory of tsconfig.json as a working directory
                        cwd = _file
                            .split(path.sep)
                            .slice(0, -1)
                            .join(path.sep);
                        application.logger.info('Using tsconfig file ', _file);
                        var tsConfigFile = application.readConfig(_file);
                        scannedFiles = tsConfigFile.files;
                        if (scannedFiles) {
                            scannedFiles = application.handlePath(scannedFiles, cwd);
                        }
                        if (typeof scannedFiles === 'undefined') {
                            excludeFiles = tsConfigFile.exclude || [];
                            includeFiles = tsConfigFile.include || [];
                            scannedFiles = [];
                            var excludeParser_2 = new ParserUtil(), includeParser_2 = new ParserUtil();
                            excludeParser_2.init(excludeFiles, cwd);
                            includeParser_2.init(includeFiles, cwd);
                            var startCwd = sourceFolder;
                            var excludeParserTestFilesWithCwdDepth = excludeParser_2.testFilesWithCwdDepth();
                            if (!excludeParserTestFilesWithCwdDepth.status) {
                                startCwd = excludeParser_2.updateCwd(cwd, excludeParserTestFilesWithCwdDepth.level);
                            }
                            var includeParserTestFilesWithCwdDepth = includeParser_2.testFilesWithCwdDepth();
                            if (!includeParser_2.testFilesWithCwdDepth().status) {
                                startCwd = includeParser_2.updateCwd(cwd, includeParserTestFilesWithCwdDepth.level);
                            }
                            var finder = require('findit2')(path.resolve(startCwd));
                            finder.on('directory', function (dir, stat, stop) {
                                var base = path.basename(dir);
                                if (base === '.git' || base === 'node_modules') {
                                    stop();
                                }
                            });
                            finder.on('file', function (file, stat) {
                                if (/(spec|\.d)\.ts/.test(file)) {
                                    application.logger.warn('Ignoring', file);
                                }
                                else if (excludeParser_2.testFile(file)) {
                                    application.logger.warn('Excluding', file);
                                }
                                else if (includeFiles.length > 0) {
                                    /**
                                     * If include provided in tsconfig, use only this source,
                                     * and not files found with global findit scan in working directory
                                     */
                                    if (path.extname(file) === '.ts' &&
                                        includeParser_2.testFile(file)) {
                                        application.logger.debug('Including', file);
                                        scannedFiles.push(file);
                                    }
                                    else {
                                        if (path.extname(file) === '.ts') {
                                            application.logger.warn('Excluding', file);
                                        }
                                    }
                                }
                                else {
                                    application.logger.debug('Including', file);
                                    scannedFiles.push(file);
                                }
                            });
                            finder.on('end', function () {
                                _super.prototype.setFiles.call(_this, scannedFiles);
                                if (program.coverageTest || program.coverageTestPerFile) {
                                    application.logger.info('Run documentation coverage test');
                                    _super.prototype.testCoverage.call(_this);
                                }
                                else {
                                    _super.prototype.generate.call(_this);
                                }
                            });
                        }
                        else {
                            _super.prototype.setFiles.call(this, scannedFiles);
                            if (program.coverageTest || program.coverageTestPerFile) {
                                application.logger.info('Run documentation coverage test');
                                _super.prototype.testCoverage.call(this);
                            }
                            else {
                                _super.prototype.generate.call(this);
                            }
                        }
                    }
                }
            }
            else {
                application.logger.error('tsconfig.json file was not found, please use -p flag');
                outputHelp();
            }
        }
    };
    return CliApplication;
}(application.Application));

exports.CliApplication = CliApplication;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtY2xpLmpzIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMvcGFyc2VyLnV0aWwuY2xhc3MudHMiLCIuLi9zcmMvaW5kZXgtY2xpLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IGdsb2IgPSByZXF1aXJlKCdnbG9iJyk7XG5cbmV4cG9ydCBjbGFzcyBQYXJzZXJVdGlsIHtcbiAgICBwcml2YXRlIF9maWxlcztcbiAgICBwcml2YXRlIF9jd2Q7XG4gICAgcHJpdmF0ZSBfZ2xvYkZpbGVzID0gW107XG5cbiAgICBwdWJsaWMgaW5pdChleGNsdWRlOiBzdHJpbmdbXSwgY3dkOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fZmlsZXMgPSBleGNsdWRlO1xuICAgICAgICB0aGlzLl9jd2QgPSBjd2Q7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgbGV0IGxlbiA9IGV4Y2x1ZGUubGVuZ3RoO1xuXG4gICAgICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9nbG9iRmlsZXMgPSBbLi4udGhpcy5fZ2xvYkZpbGVzLCAuLi5nbG9iLnN5bmMoZXhjbHVkZVtpXSwgeyBjd2Q6IHRoaXMuX2N3ZCB9KV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdGVzdEZpbGVzV2l0aEN3ZERlcHRoKCkge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGxldCBsZW4gPSB0aGlzLl9maWxlcy5sZW5ndGg7XG4gICAgICAgIGxldCByZXN1bHQgPSB7XG4gICAgICAgICAgICBzdGF0dXM6IHRydWUsXG4gICAgICAgICAgICBsZXZlbDogMFxuICAgICAgICB9O1xuICAgICAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRQYXRoID0gcGF0aC5yZXNvbHZlKHRoaXMuX2N3ZCArIHBhdGguc2VwLCB0aGlzLl9maWxlc1tpXSk7XG4gICAgICAgICAgICBpZiAoZWxlbWVudFBhdGguaW5kZXhPZih0aGlzLl9jd2QpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5zdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBsZXQgbGV2ZWwgPSB0aGlzLl9maWxlc1tpXS5tYXRjaCgvXFwuLlxcLy9nKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgaWYgKGxldmVsID4gcmVzdWx0LmxldmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5sZXZlbCA9IGxldmVsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGVDd2QoY3dkLCBsZXZlbCkge1xuICAgICAgICBsZXQgX2N3ZCA9IGN3ZCxcbiAgICAgICAgICAgIF9yZXdpbmQgPSAnJztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZXZlbDsgaSsrKSB7XG4gICAgICAgICAgICBfcmV3aW5kICs9ICcuLi8nO1xuICAgICAgICB9XG4gICAgICAgIF9jd2QgPSBwYXRoLnJlc29sdmUoX2N3ZCwgX3Jld2luZCk7XG4gICAgICAgIHJldHVybiBfY3dkO1xuICAgIH1cblxuICAgIHB1YmxpYyB0ZXN0RmlsZShmaWxlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBsZXQgbGVuID0gdGhpcy5fZmlsZXMubGVuZ3RoO1xuICAgICAgICBsZXQgZmlsZUJhc2VuYW1lID0gcGF0aC5iYXNlbmFtZShmaWxlKTtcbiAgICAgICAgbGV0IGZpbGVOYW1lSW5Dd2QgPSBmaWxlLnJlcGxhY2UodGhpcy5fY3dkICsgcGF0aC5zZXAsICcnKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChwYXRoLnNlcCA9PT0gJ1xcXFwnKSB7XG4gICAgICAgICAgICBmaWxlTmFtZUluQ3dkID0gZmlsZU5hbWVJbkN3ZC5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFwnICsgcGF0aC5zZXAsICdnJyksICcvJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKGdsb2IuaGFzTWFnaWModGhpcy5fZmlsZXNbaV0pICYmIHRoaXMuX2dsb2JGaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdEdsb2JTZWFyY2ggPSB0aGlzLl9nbG9iRmlsZXMuZmluZEluZGV4KGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbWVudFBhdGggPSBwYXRoLnJlc29sdmUodGhpcy5fY3dkICsgcGF0aC5zZXAsIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbWVudFBhdGhJbkN3ZCA9IGVsZW1lbnRQYXRoLnJlcGxhY2UodGhpcy5fY3dkICsgcGF0aC5zZXAsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudFBhdGhJbkN3ZCA9IGVsZW1lbnRQYXRoSW5Dd2QucmVwbGFjZShcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBSZWdFeHAoJ1xcXFwnICsgcGF0aC5zZXAsICdnJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAnLydcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRQYXRoSW5Dd2QgPT09IGZpbGVOYW1lSW5Dd2Q7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0R2xvYlNlYXJjaCAhPT0gLTE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZpbGVOYW1lSW5Dd2QgPT09IHRoaXMuX2ZpbGVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuIiwiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IHsgdHMgfSBmcm9tICd0cy1zaW1wbGUtYXN0JztcblxuaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICcuL2FwcC9hcHBsaWNhdGlvbic7XG5pbXBvcnQgQ29uZmlndXJhdGlvbiBmcm9tICcuL2FwcC9jb25maWd1cmF0aW9uJztcbmltcG9ydCBGaWxlRW5naW5lIGZyb20gJy4vYXBwL2VuZ2luZXMvZmlsZS5lbmdpbmUnO1xuaW1wb3J0IEkxOG5FbmdpbmUgZnJvbSAnLi9hcHAvZW5naW5lcy9pMThuLmVuZ2luZSc7XG5cbmltcG9ydCB7IENvbmZpZ3VyYXRpb25GaWxlSW50ZXJmYWNlIH0gZnJvbSAnLi9hcHAvaW50ZXJmYWNlcy9jb25maWd1cmF0aW9uLWZpbGUuaW50ZXJmYWNlJztcbmltcG9ydCBBbmd1bGFyVmVyc2lvblV0aWwgZnJvbSAnLi91dGlscy9hbmd1bGFyLXZlcnNpb24udXRpbCc7XG5pbXBvcnQgeyBDT01QT0RPQ19ERUZBVUxUUyB9IGZyb20gJy4vdXRpbHMvZGVmYXVsdHMnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHsgUGFyc2VyVXRpbCB9IGZyb20gJy4vdXRpbHMvcGFyc2VyLnV0aWwuY2xhc3MnO1xuaW1wb3J0IHsgaGFuZGxlUGF0aCwgcmVhZENvbmZpZyB9IGZyb20gJy4vdXRpbHMvdXRpbHMnO1xuXG5jb25zdCBjb3NtaWNvbmZpZyA9IHJlcXVpcmUoJ2Nvc21pY29uZmlnJyk7XG5jb25zdCBvcyA9IHJlcXVpcmUoJ29zJyk7XG5jb25zdCBvc05hbWUgPSByZXF1aXJlKCdvcy1uYW1lJyk7XG5jb25zdCBwa2cgPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKTtcbmNvbnN0IHByb2dyYW0gPSByZXF1aXJlKCdjb21tYW5kZXInKTtcblxuY29uc3QgY29zbWljb25maWdNb2R1bGVOYW1lID0gJ2NvbXBvZG9jJztcblxubGV0IHNjYW5uZWRGaWxlcyA9IFtdO1xubGV0IGV4Y2x1ZGVGaWxlcztcbmxldCBpbmNsdWRlRmlsZXM7XG5sZXQgY3dkID0gcHJvY2Vzcy5jd2QoKTtcblxucHJvY2Vzcy5zZXRNYXhMaXN0ZW5lcnMoMCk7XG5cbmV4cG9ydCBjbGFzcyBDbGlBcHBsaWNhdGlvbiBleHRlbmRzIEFwcGxpY2F0aW9uIHtcbiAgICAvKipcbiAgICAgKiBSdW4gY29tcG9kb2MgZnJvbSB0aGUgY29tbWFuZCBsaW5lLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBzdGFydCgpOiBhbnkge1xuICAgICAgICBmdW5jdGlvbiBsaXN0KHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbC5zcGxpdCgnLCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvZ3JhbVxuICAgICAgICAgICAgLnZlcnNpb24ocGtnLnZlcnNpb24pXG4gICAgICAgICAgICAudXNhZ2UoJzxzcmM+IFtvcHRpb25zXScpXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctYywgLS1jb25maWcgW2NvbmZpZ10nLFxuICAgICAgICAgICAgICAgICdBIGNvbmZpZ3VyYXRpb24gZmlsZSA6IC5jb21wb2RvY3JjLCAuY29tcG9kb2NyYy5qc29uLCAuY29tcG9kb2NyYy55YW1sIG9yIGNvbXBvZG9jIHByb3BlcnR5IGluIHBhY2thZ2UuanNvbidcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5vcHRpb24oJy1wLCAtLXRzY29uZmlnIFtjb25maWddJywgJ0EgdHNjb25maWcuanNvbiBmaWxlJylcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy1kLCAtLW91dHB1dCBbZm9sZGVyXScsXG4gICAgICAgICAgICAgICAgJ1doZXJlIHRvIHN0b3JlIHRoZSBnZW5lcmF0ZWQgZG9jdW1lbnRhdGlvbicsXG4gICAgICAgICAgICAgICAgQ09NUE9ET0NfREVGQVVMVFMuZm9sZGVyXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKCcteSwgLS1leHRUaGVtZSBbZmlsZV0nLCAnRXh0ZXJuYWwgc3R5bGluZyB0aGVtZSBmaWxlJylcbiAgICAgICAgICAgIC5vcHRpb24oJy1uLCAtLW5hbWUgW25hbWVdJywgJ1RpdGxlIGRvY3VtZW50YXRpb24nLCBDT01QT0RPQ19ERUZBVUxUUy50aXRsZSlcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy1hLCAtLWFzc2V0c0ZvbGRlciBbZm9sZGVyXScsXG4gICAgICAgICAgICAgICAgJ0V4dGVybmFsIGFzc2V0cyBmb2xkZXIgdG8gY29weSBpbiBnZW5lcmF0ZWQgZG9jdW1lbnRhdGlvbiBmb2xkZXInXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKCctbywgLS1vcGVuIFt2YWx1ZV0nLCAnT3BlbiB0aGUgZ2VuZXJhdGVkIGRvY3VtZW50YXRpb24nKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLXQsIC0tc2lsZW50JyxcbiAgICAgICAgICAgICAgICBcIkluIHNpbGVudCBtb2RlLCBsb2cgbWVzc2FnZXMgYXJlbid0IGxvZ2dlZCBpbiB0aGUgY29uc29sZVwiLFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctcywgLS1zZXJ2ZScsXG4gICAgICAgICAgICAgICAgJ1NlcnZlIGdlbmVyYXRlZCBkb2N1bWVudGF0aW9uIChkZWZhdWx0IGh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC8pJyxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbignLS1ob3N0IFtob3N0XScsICdDaGFuZ2UgZGVmYXVsdCBob3N0IGFkZHJlc3MnKVxuICAgICAgICAgICAgLm9wdGlvbignLXIsIC0tcG9ydCBbcG9ydF0nLCAnQ2hhbmdlIGRlZmF1bHQgc2VydmluZyBwb3J0JywgQ09NUE9ET0NfREVGQVVMVFMucG9ydClcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy13LCAtLXdhdGNoJyxcbiAgICAgICAgICAgICAgICAnV2F0Y2ggc291cmNlIGZpbGVzIGFmdGVyIHNlcnZlIGFuZCBmb3JjZSBkb2N1bWVudGF0aW9uIHJlYnVpbGQnLFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctZSwgLS1leHBvcnRGb3JtYXQgW2Zvcm1hdF0nLFxuICAgICAgICAgICAgICAgICdFeHBvcnQgaW4gc3BlY2lmaWVkIGZvcm1hdCAoanNvbiwgaHRtbCknLFxuICAgICAgICAgICAgICAgIENPTVBPRE9DX0RFRkFVTFRTLmV4cG9ydEZvcm1hdFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbignLS1maWxlcyBbZmlsZXNdJywgJ0ZpbGVzIHByb3ZpZGVkIGJ5IGV4dGVybmFsIHRvb2wsIHVzZWQgZm9yIGNvdmVyYWdlIHRlc3QnKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLS1sYW5ndWFnZSBbbGFuZ3VhZ2VdJyxcbiAgICAgICAgICAgICAgICAnTGFuZ3VhZ2UgdXNlZCBmb3IgdGhlIGdlbmVyYXRlZCBkb2N1bWVudGF0aW9uIChkZS1ERSwgZW4tVVMsIGVzLUVTLCBmci1GUiwgaHUtSFUsIGl0LUlULCBqYS1KUCwgbmwtTkwsIHB0LUJSLCBzay1TSywgemgtQ04pJyxcbiAgICAgICAgICAgICAgICBDT01QT0RPQ19ERUZBVUxUUy5sYW5ndWFnZVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLS10aGVtZSBbdGhlbWVdJyxcbiAgICAgICAgICAgICAgICBcIkNob29zZSBvbmUgb2YgYXZhaWxhYmxlIHRoZW1lcywgZGVmYXVsdCBpcyAnZ2l0Ym9vaycgKGxhcmF2ZWwsIG9yaWdpbmFsLCBtYXRlcmlhbCwgcG9zdG1hcmssIHJlYWR0aGVkb2NzLCBzdHJpcGUsIHZhZ3JhbnQpXCJcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy0taGlkZUdlbmVyYXRvcicsXG4gICAgICAgICAgICAgICAgJ0RvIG5vdCBwcmludCB0aGUgQ29tcG9kb2MgbGluayBhdCB0aGUgYm90dG9tIG9mIHRoZSBwYWdlJyxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLS10b2dnbGVNZW51SXRlbXMgPGl0ZW1zPicsXG4gICAgICAgICAgICAgICAgXCJDbG9zZSBieSBkZWZhdWx0IGl0ZW1zIGluIHRoZSBtZW51IHZhbHVlcyA6IFsnYWxsJ10gb3Igb25lIG9mIHRoZXNlIFsnbW9kdWxlcycsJ2NvbXBvbmVudHMnLCdkaXJlY3RpdmVzJywnY29udHJvbGxlcnMnLCdjbGFzc2VzJywnaW5qZWN0YWJsZXMnLCdndWFyZHMnLCdpbnRlcmZhY2VzJywnaW50ZXJjZXB0b3JzJywncGlwZXMnLCdtaXNjZWxsYW5lb3VzJywnYWRkaXRpb25hbFBhZ2VzJ11cIixcbiAgICAgICAgICAgICAgICBsaXN0LFxuICAgICAgICAgICAgICAgIENPTVBPRE9DX0RFRkFVTFRTLnRvZ2dsZU1lbnVJdGVtc1xuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLS1uYXZUYWJDb25maWcgPHRhYiBjb25maWdzPicsXG4gICAgICAgICAgICAgICAgYExpc3QgbmF2aWdhdGlvbiB0YWIgb2JqZWN0cyBpbiB0aGUgZGVzaXJlZCBvcmRlciB3aXRoIHR3byBzdHJpbmcgcHJvcGVydGllcyAoXCJpZFwiIGFuZCBcImxhYmVsXCIpLiBcXFxuRG91YmxlLXF1b3RlcyBtdXN0IGJlIGVzY2FwZWQgd2l0aCAnXFxcXCcuIFxcXG5BdmFpbGFibGUgdGFiIElEcyBhcmUgXCJpbmZvXCIsIFwicmVhZG1lXCIsIFwic291cmNlXCIsIFwidGVtcGxhdGVEYXRhXCIsIFwic3R5bGVEYXRhXCIsIFwidHJlZVwiLCBhbmQgXCJleGFtcGxlXCIuIFxcXG5Ob3RlOiBDZXJ0YWluIHRhYnMgd2lsbCBvbmx5IGJlIHNob3duIGlmIGFwcGxpY2FibGUgdG8gYSBnaXZlbiBkZXBlbmRlbmN5YCxcbiAgICAgICAgICAgICAgICBsaXN0LFxuICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KENPTVBPRE9DX0RFRkFVTFRTLm5hdlRhYkNvbmZpZylcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy0tdGVtcGxhdGVzIFtmb2xkZXJdJyxcbiAgICAgICAgICAgICAgICAnUGF0aCB0byBkaXJlY3Rvcnkgb2YgSGFuZGxlYmFycyB0ZW1wbGF0ZXMgdG8gb3ZlcnJpZGUgYnVpbHQtaW4gdGVtcGxhdGVzJ1xuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbignLS1pbmNsdWRlcyBbcGF0aF0nLCAnUGF0aCBvZiBleHRlcm5hbCBtYXJrZG93biBmaWxlcyB0byBpbmNsdWRlJylcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy0taW5jbHVkZXNOYW1lIFtuYW1lXScsXG4gICAgICAgICAgICAgICAgJ05hbWUgb2YgaXRlbSBtZW51IG9mIGV4dGVybmFscyBtYXJrZG93biBmaWxlcycsXG4gICAgICAgICAgICAgICAgQ09NUE9ET0NfREVGQVVMVFMuYWRkaXRpb25hbEVudHJ5TmFtZVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLS1jb3ZlcmFnZVRlc3QgW3RocmVzaG9sZF0nLFxuICAgICAgICAgICAgICAgICdUZXN0IGNvbW1hbmQgb2YgZG9jdW1lbnRhdGlvbiBjb3ZlcmFnZSB3aXRoIGEgdGhyZXNob2xkIChkZWZhdWx0IDcwKSdcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy0tY292ZXJhZ2VNaW5pbXVtUGVyRmlsZSBbbWluaW11bV0nLFxuICAgICAgICAgICAgICAgICdUZXN0IGNvbW1hbmQgb2YgZG9jdW1lbnRhdGlvbiBjb3ZlcmFnZSBwZXIgZmlsZSB3aXRoIGEgbWluaW11bSAoZGVmYXVsdCAwKSdcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy0tY292ZXJhZ2VUZXN0VGhyZXNob2xkRmFpbCBbdHJ1ZXxmYWxzZV0nLFxuICAgICAgICAgICAgICAgICdUZXN0IGNvbW1hbmQgb2YgZG9jdW1lbnRhdGlvbiBjb3ZlcmFnZSAoZ2xvYmFsIG9yIHBlciBmaWxlKSB3aWxsIGZhaWwgd2l0aCBlcnJvciBvciBqdXN0IHdhcm4gdXNlciAodHJ1ZTogZXJyb3IsIGZhbHNlOiB3YXJuKScsXG4gICAgICAgICAgICAgICAgQ09NUE9ET0NfREVGQVVMVFMuY292ZXJhZ2VUZXN0VGhyZXNob2xkRmFpbFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbignLS1jb3ZlcmFnZVRlc3RTaG93T25seUZhaWxlZCcsICdEaXNwbGF5IG9ubHkgZmFpbGVkIGZpbGVzIGZvciBhIGNvdmVyYWdlIHRlc3QnKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLS11bml0VGVzdENvdmVyYWdlIFtqc29uLXN1bW1hcnldJyxcbiAgICAgICAgICAgICAgICAnVG8gaW5jbHVkZSB1bml0IHRlc3QgY292ZXJhZ2UsIHNwZWNpZnkgaXN0YW5idWwgSlNPTiBjb3ZlcmFnZSBzdW1tYXJ5IGZpbGUnXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctLWRpc2FibGVTb3VyY2VDb2RlJyxcbiAgICAgICAgICAgICAgICAnRG8gbm90IGFkZCBzb3VyY2UgY29kZSB0YWIgYW5kIGxpbmtzIHRvIHNvdXJjZSBjb2RlJyxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbignLS1kaXNhYmxlRG9tVHJlZScsICdEbyBub3QgYWRkIGRvbSB0cmVlIHRhYicsIGZhbHNlKVxuICAgICAgICAgICAgLm9wdGlvbignLS1kaXNhYmxlVGVtcGxhdGVUYWInLCAnRG8gbm90IGFkZCB0ZW1wbGF0ZSB0YWInLCBmYWxzZSlcbiAgICAgICAgICAgIC5vcHRpb24oJy0tZGlzYWJsZVN0eWxlVGFiJywgJ0RvIG5vdCBhZGQgc3R5bGUgdGFiJywgZmFsc2UpXG4gICAgICAgICAgICAub3B0aW9uKCctLWRpc2FibGVHcmFwaCcsICdEbyBub3QgYWRkIHRoZSBkZXBlbmRlbmN5IGdyYXBoJywgZmFsc2UpXG4gICAgICAgICAgICAub3B0aW9uKCctLWRpc2FibGVDb3ZlcmFnZScsICdEbyBub3QgYWRkIHRoZSBkb2N1bWVudGF0aW9uIGNvdmVyYWdlIHJlcG9ydCcsIGZhbHNlKVxuICAgICAgICAgICAgLm9wdGlvbignLS1kaXNhYmxlUHJpdmF0ZScsICdEbyBub3Qgc2hvdyBwcml2YXRlIGluIGdlbmVyYXRlZCBkb2N1bWVudGF0aW9uJywgZmFsc2UpXG4gICAgICAgICAgICAub3B0aW9uKCctLWRpc2FibGVQcm90ZWN0ZWQnLCAnRG8gbm90IHNob3cgcHJvdGVjdGVkIGluIGdlbmVyYXRlZCBkb2N1bWVudGF0aW9uJywgZmFsc2UpXG4gICAgICAgICAgICAub3B0aW9uKCctLWRpc2FibGVJbnRlcm5hbCcsICdEbyBub3Qgc2hvdyBAaW50ZXJuYWwgaW4gZ2VuZXJhdGVkIGRvY3VtZW50YXRpb24nLCBmYWxzZSlcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy0tZGlzYWJsZUxpZmVDeWNsZUhvb2tzJyxcbiAgICAgICAgICAgICAgICAnRG8gbm90IHNob3cgQW5ndWxhciBsaWZlY3ljbGUgaG9va3MgaW4gZ2VuZXJhdGVkIGRvY3VtZW50YXRpb24nLFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctLWRpc2FibGVSb3V0ZXNHcmFwaCcsXG4gICAgICAgICAgICAgICAgJ0RvIG5vdCBhZGQgdGhlIHJvdXRlcyBncmFwaCcsXG4gICAgICAgICAgICAgICAgQ09NUE9ET0NfREVGQVVMVFMuZGlzYWJsZVJvdXRlc0dyYXBoXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKCctLWRpc2FibGVTZWFyY2gnLCAnRG8gbm90IGFkZCB0aGUgc2VhcmNoIGlucHV0JywgZmFsc2UpXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctLWRpc2FibGVEZXBlbmRlbmNpZXMnLFxuICAgICAgICAgICAgICAgICdEbyBub3QgYWRkIHRoZSBkZXBlbmRlbmNpZXMgbGlzdCcsXG4gICAgICAgICAgICAgICAgQ09NUE9ET0NfREVGQVVMVFMuZGlzYWJsZURlcGVuZGVuY2llc1xuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLS1taW5pbWFsJyxcbiAgICAgICAgICAgICAgICAnTWluaW1hbCBtb2RlIHdpdGggb25seSBkb2N1bWVudGF0aW9uLiBObyBzZWFyY2gsIG5vIGdyYXBoLCBubyBjb3ZlcmFnZS4nLFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKCctLWN1c3RvbUZhdmljb24gW3BhdGhdJywgJ1VzZSBhIGN1c3RvbSBmYXZpY29uJylcbiAgICAgICAgICAgIC5vcHRpb24oJy0tY3VzdG9tTG9nbyBbcGF0aF0nLCAnVXNlIGEgY3VzdG9tIGxvZ28nKVxuICAgICAgICAgICAgLm9wdGlvbignLS1nYUlEIFtpZF0nLCAnR29vZ2xlIEFuYWx5dGljcyB0cmFja2luZyBJRCcpXG4gICAgICAgICAgICAub3B0aW9uKCctLWdhU2l0ZSBbc2l0ZV0nLCAnR29vZ2xlIEFuYWx5dGljcyBzaXRlIG5hbWUnLCBDT01QT0RPQ19ERUZBVUxUUy5nYVNpdGUpXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctLW1heFNlYXJjaFJlc3VsdHMgW21heFNlYXJjaFJlc3VsdHNdJyxcbiAgICAgICAgICAgICAgICAnTWF4IHNlYXJjaCByZXN1bHRzIG9uIHRoZSByZXN1bHRzIHBhZ2UuIFRvIHNob3cgYWxsIHJlc3VsdHMsIHNldCB0byAwJyxcbiAgICAgICAgICAgICAgICBDT01QT0RPQ19ERUZBVUxUUy5tYXhTZWFyY2hSZXN1bHRzXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAucGFyc2UocHJvY2Vzcy5hcmd2KTtcblxuICAgICAgICBsZXQgb3V0cHV0SGVscCA9ICgpID0+IHtcbiAgICAgICAgICAgIHByb2dyYW0ub3V0cHV0SGVscCgpO1xuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGNvbmZpZ0V4cGxvcmVyID0gY29zbWljb25maWcoY29zbWljb25maWdNb2R1bGVOYW1lKTtcblxuICAgICAgICBsZXQgY29uZmlnRXhwbG9yZXJSZXN1bHQ7XG5cbiAgICAgICAgbGV0IGNvbmZpZ0ZpbGU6IENvbmZpZ3VyYXRpb25GaWxlSW50ZXJmYWNlID0ge307XG5cbiAgICAgICAgaWYgKHByb2dyYW0uY29uZmlnKSB7XG4gICAgICAgICAgICBsZXQgY29uZmlnRmlsZVBhdGggPSBwcm9ncmFtLmNvbmZpZztcbiAgICAgICAgICAgIGxldCB0ZXN0Q29uZmlnRmlsZVBhdGggPSBjb25maWdGaWxlUGF0aC5tYXRjaChwcm9jZXNzLmN3ZCgpKTtcbiAgICAgICAgICAgIGlmICh0ZXN0Q29uZmlnRmlsZVBhdGggJiYgdGVzdENvbmZpZ0ZpbGVQYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25maWdGaWxlUGF0aCA9IGNvbmZpZ0ZpbGVQYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSArIHBhdGguc2VwLCAnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25maWdFeHBsb3JlclJlc3VsdCA9IGNvbmZpZ0V4cGxvcmVyLmxvYWRTeW5jKHBhdGgucmVzb2x2ZShjb25maWdGaWxlUGF0aCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uZmlnRXhwbG9yZXJSZXN1bHQgPSBjb25maWdFeHBsb3Jlci5zZWFyY2hTeW5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbmZpZ0V4cGxvcmVyUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbmZpZ0V4cGxvcmVyUmVzdWx0LmNvbmZpZyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBjb25maWdGaWxlID0gY29uZmlnRXhwbG9yZXJSZXN1bHQuY29uZmlnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUub3V0cHV0KSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dCA9IGNvbmZpZ0ZpbGUub3V0cHV0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLm91dHB1dCAmJiBwcm9ncmFtLm91dHB1dCAhPT0gQ09NUE9ET0NfREVGQVVMVFMuZm9sZGVyKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dCA9IHByb2dyYW0ub3V0cHV0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZXh0VGhlbWUpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZXh0VGhlbWUgPSBjb25maWdGaWxlLmV4dFRoZW1lO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmV4dFRoZW1lKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmV4dFRoZW1lID0gcHJvZ3JhbS5leHRUaGVtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmxhbmd1YWdlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmxhbmd1YWdlID0gY29uZmlnRmlsZS5sYW5ndWFnZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5sYW5ndWFnZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5sYW5ndWFnZSA9IHByb2dyYW0ubGFuZ3VhZ2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS50aGVtZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS50aGVtZSA9IGNvbmZpZ0ZpbGUudGhlbWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0udGhlbWUpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudGhlbWUgPSBwcm9ncmFtLnRoZW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUubmFtZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kb2N1bWVudGF0aW9uTWFpbk5hbWUgPSBjb25maWdGaWxlLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0ubmFtZSAmJiBwcm9ncmFtLm5hbWUgIT09IENPTVBPRE9DX0RFRkFVTFRTLnRpdGxlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRvY3VtZW50YXRpb25NYWluTmFtZSA9IHByb2dyYW0ubmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmFzc2V0c0ZvbGRlcikge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5hc3NldHNGb2xkZXIgPSBjb25maWdGaWxlLmFzc2V0c0ZvbGRlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5hc3NldHNGb2xkZXIpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuYXNzZXRzRm9sZGVyID0gcHJvZ3JhbS5hc3NldHNGb2xkZXI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5vcGVuKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm9wZW4gPSBjb25maWdGaWxlLm9wZW47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0ub3Blbikge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vcGVuID0gcHJvZ3JhbS5vcGVuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUudG9nZ2xlTWVudUl0ZW1zKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnRvZ2dsZU1lbnVJdGVtcyA9IGNvbmZpZ0ZpbGUudG9nZ2xlTWVudUl0ZW1zO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHByb2dyYW0udG9nZ2xlTWVudUl0ZW1zICYmXG4gICAgICAgICAgICBwcm9ncmFtLnRvZ2dsZU1lbnVJdGVtcyAhPT0gQ09NUE9ET0NfREVGQVVMVFMudG9nZ2xlTWVudUl0ZW1zXG4gICAgICAgICkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS50b2dnbGVNZW51SXRlbXMgPSBwcm9ncmFtLnRvZ2dsZU1lbnVJdGVtcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLnRlbXBsYXRlcykge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS50ZW1wbGF0ZXMgPSBjb25maWdGaWxlLnRlbXBsYXRlcztcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS50ZW1wbGF0ZXMpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudGVtcGxhdGVzID0gcHJvZ3JhbS50ZW1wbGF0ZXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5uYXZUYWJDb25maWcpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEubmF2VGFiQ29uZmlnID0gY29uZmlnRmlsZS5uYXZUYWJDb25maWc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgcHJvZ3JhbS5uYXZUYWJDb25maWcgJiZcbiAgICAgICAgICAgIEpTT04ucGFyc2UocHJvZ3JhbS5uYXZUYWJDb25maWcpLmxlbmd0aCAhPT0gQ09NUE9ET0NfREVGQVVMVFMubmF2VGFiQ29uZmlnLmxlbmd0aFxuICAgICAgICApIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEubmF2VGFiQ29uZmlnID0gSlNPTi5wYXJzZShwcm9ncmFtLm5hdlRhYkNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5pbmNsdWRlcykge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5pbmNsdWRlcyA9IGNvbmZpZ0ZpbGUuaW5jbHVkZXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uaW5jbHVkZXMpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaW5jbHVkZXMgPSBwcm9ncmFtLmluY2x1ZGVzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuaW5jbHVkZXNOYW1lKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmluY2x1ZGVzTmFtZSA9IGNvbmZpZ0ZpbGUuaW5jbHVkZXNOYW1lO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHByb2dyYW0uaW5jbHVkZXNOYW1lICYmXG4gICAgICAgICAgICBwcm9ncmFtLmluY2x1ZGVzTmFtZSAhPT0gQ09NUE9ET0NfREVGQVVMVFMuYWRkaXRpb25hbEVudHJ5TmFtZVxuICAgICAgICApIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaW5jbHVkZXNOYW1lID0gcHJvZ3JhbS5pbmNsdWRlc05hbWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5zaWxlbnQpIHtcbiAgICAgICAgICAgIGxvZ2dlci5zaWxlbnQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5zaWxlbnQpIHtcbiAgICAgICAgICAgIGxvZ2dlci5zaWxlbnQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLnNlcnZlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnNlcnZlID0gY29uZmlnRmlsZS5zZXJ2ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5zZXJ2ZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5zZXJ2ZSA9IHByb2dyYW0uc2VydmU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5ob3N0KSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmhvc3QgPSBjb25maWdGaWxlLmhvc3Q7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmhvc3RuYW1lID0gY29uZmlnRmlsZS5ob3N0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmhvc3QpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaG9zdCA9IHByb2dyYW0uaG9zdDtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaG9zdG5hbWUgPSBwcm9ncmFtLmhvc3Q7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5wb3J0KSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnBvcnQgPSBjb25maWdGaWxlLnBvcnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0ucG9ydCAmJiBwcm9ncmFtLnBvcnQgIT09IENPTVBPRE9DX0RFRkFVTFRTLnBvcnQpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEucG9ydCA9IHByb2dyYW0ucG9ydDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLndhdGNoKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLndhdGNoID0gY29uZmlnRmlsZS53YXRjaDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS53YXRjaCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS53YXRjaCA9IHByb2dyYW0ud2F0Y2g7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5leHBvcnRGb3JtYXQpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZXhwb3J0Rm9ybWF0ID0gY29uZmlnRmlsZS5leHBvcnRGb3JtYXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uZXhwb3J0Rm9ybWF0ICYmIHByb2dyYW0uZXhwb3J0Rm9ybWF0ICE9PSBDT01QT0RPQ19ERUZBVUxUUy5leHBvcnRGb3JtYXQpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZXhwb3J0Rm9ybWF0ID0gcHJvZ3JhbS5leHBvcnRGb3JtYXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5oaWRlR2VuZXJhdG9yKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmhpZGVHZW5lcmF0b3IgPSBjb25maWdGaWxlLmhpZGVHZW5lcmF0b3I7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uaGlkZUdlbmVyYXRvcikge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5oaWRlR2VuZXJhdG9yID0gcHJvZ3JhbS5oaWRlR2VuZXJhdG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuY292ZXJhZ2VUZXN0KSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdCA9IHRydWU7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFRocmVzaG9sZCA9XG4gICAgICAgICAgICAgICAgdHlwZW9mIGNvbmZpZ0ZpbGUuY292ZXJhZ2VUZXN0ID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICA/IHBhcnNlSW50KGNvbmZpZ0ZpbGUuY292ZXJhZ2VUZXN0LCAxMClcbiAgICAgICAgICAgICAgICAgICAgOiBDT01QT0RPQ19ERUZBVUxUUy5kZWZhdWx0Q292ZXJhZ2VUaHJlc2hvbGQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uY292ZXJhZ2VUZXN0KSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdCA9IHRydWU7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFRocmVzaG9sZCA9XG4gICAgICAgICAgICAgICAgdHlwZW9mIHByb2dyYW0uY292ZXJhZ2VUZXN0ID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICA/IHBhcnNlSW50KHByb2dyYW0uY292ZXJhZ2VUZXN0LCAxMClcbiAgICAgICAgICAgICAgICAgICAgOiBDT01QT0RPQ19ERUZBVUxUUy5kZWZhdWx0Q292ZXJhZ2VUaHJlc2hvbGQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5jb3ZlcmFnZU1pbmltdW1QZXJGaWxlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFBlckZpbGUgPSB0cnVlO1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZU1pbmltdW1QZXJGaWxlID1cbiAgICAgICAgICAgICAgICB0eXBlb2YgY29uZmlnRmlsZS5jb3ZlcmFnZU1pbmltdW1QZXJGaWxlID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICA/IHBhcnNlSW50KGNvbmZpZ0ZpbGUuY292ZXJhZ2VNaW5pbXVtUGVyRmlsZSwgMTApXG4gICAgICAgICAgICAgICAgICAgIDogQ09NUE9ET0NfREVGQVVMVFMuZGVmYXVsdENvdmVyYWdlTWluaW11bVBlckZpbGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uY292ZXJhZ2VNaW5pbXVtUGVyRmlsZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3RQZXJGaWxlID0gdHJ1ZTtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VNaW5pbXVtUGVyRmlsZSA9XG4gICAgICAgICAgICAgICAgdHlwZW9mIHByb2dyYW0uY292ZXJhZ2VNaW5pbXVtUGVyRmlsZSA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICAgICAgPyBwYXJzZUludChwcm9ncmFtLmNvdmVyYWdlTWluaW11bVBlckZpbGUsIDEwKVxuICAgICAgICAgICAgICAgICAgICA6IENPTVBPRE9DX0RFRkFVTFRTLmRlZmF1bHRDb3ZlcmFnZU1pbmltdW1QZXJGaWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuY292ZXJhZ2VUZXN0VGhyZXNob2xkRmFpbCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3RUaHJlc2hvbGRGYWlsID1cbiAgICAgICAgICAgICAgICBjb25maWdGaWxlLmNvdmVyYWdlVGVzdFRocmVzaG9sZEZhaWwgPT09ICdmYWxzZScgPyBmYWxzZSA6IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uY292ZXJhZ2VUZXN0VGhyZXNob2xkRmFpbCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3RUaHJlc2hvbGRGYWlsID1cbiAgICAgICAgICAgICAgICBwcm9ncmFtLmNvdmVyYWdlVGVzdFRocmVzaG9sZEZhaWwgPT09ICdmYWxzZScgPyBmYWxzZSA6IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5jb3ZlcmFnZVRlc3RTaG93T25seUZhaWxlZCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3RTaG93T25seUZhaWxlZCA9XG4gICAgICAgICAgICAgICAgY29uZmlnRmlsZS5jb3ZlcmFnZVRlc3RTaG93T25seUZhaWxlZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5jb3ZlcmFnZVRlc3RTaG93T25seUZhaWxlZCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3RTaG93T25seUZhaWxlZCA9IHByb2dyYW0uY292ZXJhZ2VUZXN0U2hvd09ubHlGYWlsZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS51bml0VGVzdENvdmVyYWdlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnVuaXRUZXN0Q292ZXJhZ2UgPSBjb25maWdGaWxlLnVuaXRUZXN0Q292ZXJhZ2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0udW5pdFRlc3RDb3ZlcmFnZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS51bml0VGVzdENvdmVyYWdlID0gcHJvZ3JhbS51bml0VGVzdENvdmVyYWdlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZGlzYWJsZVNvdXJjZUNvZGUpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVNvdXJjZUNvZGUgPSBjb25maWdGaWxlLmRpc2FibGVTb3VyY2VDb2RlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmRpc2FibGVTb3VyY2VDb2RlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVTb3VyY2VDb2RlID0gcHJvZ3JhbS5kaXNhYmxlU291cmNlQ29kZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmRpc2FibGVEb21UcmVlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVEb21UcmVlID0gY29uZmlnRmlsZS5kaXNhYmxlRG9tVHJlZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5kaXNhYmxlRG9tVHJlZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlRG9tVHJlZSA9IHByb2dyYW0uZGlzYWJsZURvbVRyZWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5kaXNhYmxlVGVtcGxhdGVUYWIpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVRlbXBsYXRlVGFiID0gY29uZmlnRmlsZS5kaXNhYmxlVGVtcGxhdGVUYWI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uZGlzYWJsZVRlbXBsYXRlVGFiKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVUZW1wbGF0ZVRhYiA9IHByb2dyYW0uZGlzYWJsZVRlbXBsYXRlVGFiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZGlzYWJsZVN0eWxlVGFiKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVTdHlsZVRhYiA9IGNvbmZpZ0ZpbGUuZGlzYWJsZVN0eWxlVGFiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmRpc2FibGVTdHlsZVRhYikge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlU3R5bGVUYWIgPSBwcm9ncmFtLmRpc2FibGVTdHlsZVRhYjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmRpc2FibGVHcmFwaCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlR3JhcGggPSBjb25maWdGaWxlLmRpc2FibGVHcmFwaDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5kaXNhYmxlR3JhcGgpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZUdyYXBoID0gcHJvZ3JhbS5kaXNhYmxlR3JhcGg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5kaXNhYmxlQ292ZXJhZ2UpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZUNvdmVyYWdlID0gY29uZmlnRmlsZS5kaXNhYmxlQ292ZXJhZ2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uZGlzYWJsZUNvdmVyYWdlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVDb3ZlcmFnZSA9IHByb2dyYW0uZGlzYWJsZUNvdmVyYWdlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZGlzYWJsZVByaXZhdGUpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVByaXZhdGUgPSBjb25maWdGaWxlLmRpc2FibGVQcml2YXRlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmRpc2FibGVQcml2YXRlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVQcml2YXRlID0gcHJvZ3JhbS5kaXNhYmxlUHJpdmF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmRpc2FibGVQcm90ZWN0ZWQpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVByb3RlY3RlZCA9IGNvbmZpZ0ZpbGUuZGlzYWJsZVByb3RlY3RlZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5kaXNhYmxlUHJvdGVjdGVkKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVQcm90ZWN0ZWQgPSBwcm9ncmFtLmRpc2FibGVQcm90ZWN0ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5kaXNhYmxlSW50ZXJuYWwpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZUludGVybmFsID0gY29uZmlnRmlsZS5kaXNhYmxlSW50ZXJuYWw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uZGlzYWJsZUludGVybmFsKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVJbnRlcm5hbCA9IHByb2dyYW0uZGlzYWJsZUludGVybmFsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZGlzYWJsZUxpZmVDeWNsZUhvb2tzKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVMaWZlQ3ljbGVIb29rcyA9IGNvbmZpZ0ZpbGUuZGlzYWJsZUxpZmVDeWNsZUhvb2tzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmRpc2FibGVMaWZlQ3ljbGVIb29rcykge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlTGlmZUN5Y2xlSG9va3MgPSBwcm9ncmFtLmRpc2FibGVMaWZlQ3ljbGVIb29rcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmRpc2FibGVSb3V0ZXNHcmFwaCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlUm91dGVzR3JhcGggPSBjb25maWdGaWxlLmRpc2FibGVSb3V0ZXNHcmFwaDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5kaXNhYmxlUm91dGVzR3JhcGgpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVJvdXRlc0dyYXBoID0gcHJvZ3JhbS5kaXNhYmxlUm91dGVzR3JhcGg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5kaXNhYmxlU2VhcmNoKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVTZWFyY2ggPSBjb25maWdGaWxlLmRpc2FibGVTZWFyY2g7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uZGlzYWJsZVNlYXJjaCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlU2VhcmNoID0gcHJvZ3JhbS5kaXNhYmxlU2VhcmNoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZGlzYWJsZURlcGVuZGVuY2llcykge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlRGVwZW5kZW5jaWVzID0gY29uZmlnRmlsZS5kaXNhYmxlRGVwZW5kZW5jaWVzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmRpc2FibGVEZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZURlcGVuZGVuY2llcyA9IHByb2dyYW0uZGlzYWJsZURlcGVuZGVuY2llcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLm1pbmltYWwpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVNlYXJjaCA9IHRydWU7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVSb3V0ZXNHcmFwaCA9IHRydWU7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVHcmFwaCA9IHRydWU7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVDb3ZlcmFnZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0ubWluaW1hbCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlU2VhcmNoID0gdHJ1ZTtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVJvdXRlc0dyYXBoID0gdHJ1ZTtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZUdyYXBoID0gdHJ1ZTtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZUNvdmVyYWdlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmN1c3RvbUZhdmljb24pIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY3VzdG9tRmF2aWNvbiA9IGNvbmZpZ0ZpbGUuY3VzdG9tRmF2aWNvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5jdXN0b21GYXZpY29uKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmN1c3RvbUZhdmljb24gPSBwcm9ncmFtLmN1c3RvbUZhdmljb247XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5jdXN0b21Mb2dvKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmN1c3RvbUxvZ28gPSBjb25maWdGaWxlLmN1c3RvbUxvZ287XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uY3VzdG9tTG9nbykge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jdXN0b21Mb2dvID0gcHJvZ3JhbS5jdXN0b21Mb2dvO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZ2FJRCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5nYUlEID0gY29uZmlnRmlsZS5nYUlEO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmdhSUQpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZ2FJRCA9IHByb2dyYW0uZ2FJRDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmdhU2l0ZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5nYVNpdGUgPSBjb25maWdGaWxlLmdhU2l0ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5nYVNpdGUgJiYgcHJvZ3JhbS5nYVNpdGUgIT09IENPTVBPRE9DX0RFRkFVTFRTLmdhU2l0ZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5nYVNpdGUgPSBwcm9ncmFtLmdhU2l0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5pc1dhdGNoaW5nKSB7XG4gICAgICAgICAgICBpZiAoIWxvZ2dlci5zaWxlbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgQ29tcG9kb2MgdiR7cGtnLnZlcnNpb259YCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vc3JjL2Jhbm5lcicpKS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwa2cudmVyc2lvbik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJycpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBUeXBlU2NyaXB0IHZlcnNpb24gdXNlZCBieSBDb21wb2RvYyA6ICR7dHMudmVyc2lvbn1gKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoRmlsZUVuZ2luZS5leGlzdHNTeW5jKGN3ZCArIHBhdGguc2VwICsgJ3BhY2thZ2UuanNvbicpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VEYXRhID0gRmlsZUVuZ2luZS5nZXRTeW5jKGN3ZCArIHBhdGguc2VwICsgJ3BhY2thZ2UuanNvbicpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFja2FnZURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZERhdGEgPSBKU09OLnBhcnNlKHBhY2thZ2VEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2plY3REZXZEZXBlbmRlbmNpZXMgPSBwYXJzZWREYXRhLmRldkRlcGVuZGVuY2llcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9qZWN0RGV2RGVwZW5kZW5jaWVzICYmIHByb2plY3REZXZEZXBlbmRlbmNpZXMudHlwZXNjcmlwdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRzUHJvamVjdFZlcnNpb24gPSBBbmd1bGFyVmVyc2lvblV0aWwuY2xlYW5WZXJzaW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0RGV2RGVwZW5kZW5jaWVzLnR5cGVzY3JpcHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgVHlwZVNjcmlwdCB2ZXJzaW9uIG9mIGN1cnJlbnQgcHJvamVjdCA6ICR7dHNQcm9qZWN0VmVyc2lvbn1gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYE5vZGUuanMgdmVyc2lvbiA6ICR7cHJvY2Vzcy52ZXJzaW9ufWApO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCcnKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgT3BlcmF0aW5nIHN5c3RlbSA6ICR7b3NOYW1lKG9zLnBsYXRmb3JtKCksIG9zLnJlbGVhc2UoKSl9YCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0V4cGxvcmVyUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbmZpZ0V4cGxvcmVyUmVzdWx0LmNvbmZpZyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgVXNpbmcgY29uZmlndXJhdGlvbiBmaWxlIDogJHtjb25maWdFeHBsb3JlclJlc3VsdC5maWxlcGF0aH1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY29uZmlnRXhwbG9yZXJSZXN1bHQpIHtcbiAgICAgICAgICAgIGxvZ2dlci53YXJuKGBObyBjb25maWd1cmF0aW9uIGZpbGUgZm91bmQsIHN3aXRjaGluZyB0byBDTEkgZmxhZ3MuYCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvZ3JhbS5sYW5ndWFnZSAmJiAhSTE4bkVuZ2luZS5zdXBwb3J0TGFuZ3VhZ2UocHJvZ3JhbS5sYW5ndWFnZSkpIHtcbiAgICAgICAgICAgIGxvZ2dlci53YXJuKFxuICAgICAgICAgICAgICAgIGBUaGUgbGFuZ3VhZ2UgJHtwcm9ncmFtLmxhbmd1YWdlfSBpcyBub3QgYXZhaWxhYmxlLCBmYWxsaW5nIGJhY2sgdG8gJHtJMThuRW5naW5lLmZhbGxiYWNrTGFuZ3VhZ2V9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9ncmFtLnRzY29uZmlnICYmIHR5cGVvZiBwcm9ncmFtLnRzY29uZmlnID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgUGxlYXNlIHByb3ZpZGUgYSB0c2NvbmZpZyBmaWxlLmApO1xuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUudHNjb25maWcpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWcgPSBjb25maWdGaWxlLnRzY29uZmlnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLnRzY29uZmlnKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnID0gcHJvZ3JhbS50c2NvbmZpZztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9ncmFtLm1heFNlYXJjaFJlc3VsdHMpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEubWF4U2VhcmNoUmVzdWx0cyA9IHByb2dyYW0ubWF4U2VhcmNoUmVzdWx0cztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmZpbGVzKSB7XG4gICAgICAgICAgICBzY2FubmVkRmlsZXMgPSBjb25maWdGaWxlLmZpbGVzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb25maWdGaWxlLmV4Y2x1ZGUpIHtcbiAgICAgICAgICAgIGV4Y2x1ZGVGaWxlcyA9IGNvbmZpZ0ZpbGUuZXhjbHVkZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29uZmlnRmlsZS5pbmNsdWRlKSB7XG4gICAgICAgICAgICBpbmNsdWRlRmlsZXMgPSBjb25maWdGaWxlLmluY2x1ZGU7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hlY2sgLS1maWxlcyBhcmd1bWVudCBjYWxsXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBhcmd2ID0gcmVxdWlyZSgnbWluaW1pc3QnKShwcm9jZXNzLmFyZ3Yuc2xpY2UoMikpO1xuICAgICAgICBpZiAoYXJndiAmJiBhcmd2LmZpbGVzKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmhhc0ZpbGVzVG9Db3ZlcmFnZSA9IHRydWU7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3YuZmlsZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgc3VwZXIuc2V0RmlsZXMoW2FyZ3YuZmlsZXNdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3VwZXIuc2V0RmlsZXMoYXJndi5maWxlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvZ3JhbS5zZXJ2ZSAmJiAhQ29uZmlndXJhdGlvbi5tYWluRGF0YS50c2NvbmZpZyAmJiBwcm9ncmFtLm91dHB1dCkge1xuICAgICAgICAgICAgLy8gaWYgLXMgJiAtZCwgc2VydmUgaXRcbiAgICAgICAgICAgIGlmICghRmlsZUVuZ2luZS5leGlzdHNTeW5jKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0KSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgJHtDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dH0gZm9sZGVyIGRvZXNuJ3QgZXhpc3RgKTtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKFxuICAgICAgICAgICAgICAgICAgICBgU2VydmluZyBkb2N1bWVudGF0aW9uIGZyb20gJHtDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dH0gYXQgaHR0cDovLyR7Q29uZmlndXJhdGlvbi5tYWluRGF0YS5ob3N0bmFtZX06JHtwcm9ncmFtLnBvcnR9YFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgc3VwZXIucnVuV2ViU2VydmVyKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChwcm9ncmFtLnNlcnZlICYmICFDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnICYmICFwcm9ncmFtLm91dHB1dCkge1xuICAgICAgICAgICAgLy8gaWYgb25seSAtcyBmaW5kIC4vZG9jdW1lbnRhdGlvbiwgaWYgb2sgc2VydmUsIGVsc2UgZXJyb3IgcHJvdmlkZSAtZFxuICAgICAgICAgICAgaWYgKCFGaWxlRW5naW5lLmV4aXN0c1N5bmMoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQpKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdQcm92aWRlIG91dHB1dCBnZW5lcmF0ZWQgZm9sZGVyIHdpdGggLWQgZmxhZycpO1xuICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oXG4gICAgICAgICAgICAgICAgICAgIGBTZXJ2aW5nIGRvY3VtZW50YXRpb24gZnJvbSAke0NvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0fSBhdCBodHRwOi8vJHtDb25maWd1cmF0aW9uLm1haW5EYXRhLmhvc3RuYW1lfToke3Byb2dyYW0ucG9ydH1gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBzdXBlci5ydW5XZWJTZXJ2ZXIoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaGFzRmlsZXNUb0NvdmVyYWdlKSB7XG4gICAgICAgICAgICBpZiAocHJvZ3JhbS5jb3ZlcmFnZU1pbmltdW1QZXJGaWxlKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1J1biBkb2N1bWVudGF0aW9uIGNvdmVyYWdlIHRlc3QgZm9yIGZpbGVzJyk7XG4gICAgICAgICAgICAgICAgc3VwZXIudGVzdENvdmVyYWdlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignTWlzc2luZyBjb3ZlcmFnZSBjb25maWd1cmF0aW9uJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocHJvZ3JhbS5oaWRlR2VuZXJhdG9yKSB7XG4gICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5oaWRlR2VuZXJhdG9yID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWcgJiYgcHJvZ3JhbS5hcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIHRzY29uZmlnIGZpbGUgcHJvdmlkZWQgb25seVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGxldCB0ZXN0VHNDb25maWdQYXRoID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS50c2NvbmZpZy5pbmRleE9mKHByb2Nlc3MuY3dkKCkpO1xuICAgICAgICAgICAgICAgIGlmICh0ZXN0VHNDb25maWdQYXRoICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS50c2NvbmZpZy5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5jd2QoKSArIHBhdGguc2VwLFxuICAgICAgICAgICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIUZpbGVFbmdpbmUuZXhpc3RzU3luYyhDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnKSkge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICBgXCIke0NvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWd9XCIgZmlsZSB3YXMgbm90IGZvdW5kIGluIHRoZSBjdXJyZW50IGRpcmVjdG9yeWBcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBfZmlsZSA9IHBhdGguam9pbihcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBwYXRoLmRpcm5hbWUoQ29uZmlndXJhdGlvbi5tYWluRGF0YS50c2NvbmZpZykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aC5iYXNlbmFtZShDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAvLyB1c2UgdGhlIGN1cnJlbnQgZGlyZWN0b3J5IG9mIHRzY29uZmlnLmpzb24gYXMgYSB3b3JraW5nIGRpcmVjdG9yeVxuICAgICAgICAgICAgICAgICAgICBjd2QgPSBfZmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGl0KHBhdGguc2VwKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNsaWNlKDAsIC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4ocGF0aC5zZXApO1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnVXNpbmcgdHNjb25maWcgZmlsZSAnLCBfZmlsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHRzQ29uZmlnRmlsZSA9IHJlYWRDb25maWcoX2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICBzY2FubmVkRmlsZXMgPSB0c0NvbmZpZ0ZpbGUuZmlsZXM7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzY2FubmVkRmlsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYW5uZWRGaWxlcyA9IGhhbmRsZVBhdGgoc2Nhbm5lZEZpbGVzLCBjd2QpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzY2FubmVkRmlsZXMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleGNsdWRlRmlsZXMgPSB0c0NvbmZpZ0ZpbGUuZXhjbHVkZSB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVGaWxlcyA9IHRzQ29uZmlnRmlsZS5pbmNsdWRlIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Nhbm5lZEZpbGVzID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBleGNsdWRlUGFyc2VyID0gbmV3IFBhcnNlclV0aWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlUGFyc2VyID0gbmV3IFBhcnNlclV0aWwoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZXhjbHVkZVBhcnNlci5pbml0KGV4Y2x1ZGVGaWxlcywgY3dkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVQYXJzZXIuaW5pdChpbmNsdWRlRmlsZXMsIGN3ZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdGFydEN3ZCA9IGN3ZDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGV4Y2x1ZGVQYXJzZXJUZXN0RmlsZXNXaXRoQ3dkRGVwdGggPSBleGNsdWRlUGFyc2VyLnRlc3RGaWxlc1dpdGhDd2REZXB0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFleGNsdWRlUGFyc2VyVGVzdEZpbGVzV2l0aEN3ZERlcHRoLnN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0Q3dkID0gZXhjbHVkZVBhcnNlci51cGRhdGVDd2QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN3ZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhjbHVkZVBhcnNlclRlc3RGaWxlc1dpdGhDd2REZXB0aC5sZXZlbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5jbHVkZVBhcnNlclRlc3RGaWxlc1dpdGhDd2REZXB0aCA9IGluY2x1ZGVQYXJzZXIudGVzdEZpbGVzV2l0aEN3ZERlcHRoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWluY2x1ZGVQYXJzZXIudGVzdEZpbGVzV2l0aEN3ZERlcHRoKCkuc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRDd2QgPSBpbmNsdWRlUGFyc2VyLnVwZGF0ZUN3ZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3dkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlUGFyc2VyVGVzdEZpbGVzV2l0aEN3ZERlcHRoLmxldmVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbmRlciA9IHJlcXVpcmUoJ2ZpbmRpdDInKShzdGFydEN3ZCB8fCAnLicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5kZXIub24oJ2RpcmVjdG9yeScsIGZ1bmN0aW9uKGRpciwgc3RhdCwgc3RvcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBiYXNlID0gcGF0aC5iYXNlbmFtZShkaXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiYXNlID09PSAnLmdpdCcgfHwgYmFzZSA9PT0gJ25vZGVfbW9kdWxlcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5kZXIub24oJ2ZpbGUnLCAoZmlsZSwgc3RhdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgvKHNwZWN8XFwuZClcXC50cy8udGVzdChmaWxlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIud2FybignSWdub3JpbmcnLCBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGNsdWRlUGFyc2VyLnRlc3RGaWxlKGZpbGUpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGguZXh0bmFtZShmaWxlKSA9PT0gJy50cydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4oJ0V4Y2x1ZGluZycsIGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5jbHVkZUZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIElmIGluY2x1ZGUgcHJvdmlkZWQgaW4gdHNjb25maWcsIHVzZSBvbmx5IHRoaXMgc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBhbmQgbm90IGZpbGVzIGZvdW5kIHdpdGggZ2xvYmFsIGZpbmRpdCBzY2FuIGluIHdvcmtpbmcgZGlyZWN0b3J5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGF0aC5leHRuYW1lKGZpbGUpID09PSAnLnRzJyAmJiBpbmNsdWRlUGFyc2VyLnRlc3RGaWxlKGZpbGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoJ0luY2x1ZGluZycsIGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nhbm5lZEZpbGVzLnB1c2goZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGF0aC5leHRuYW1lKGZpbGUpID09PSAnLnRzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKCdFeGNsdWRpbmcnLCBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnSW5jbHVkaW5nJywgZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYW5uZWRGaWxlcy5wdXNoKGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5kZXIub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlci5zZXRGaWxlcyhzY2FubmVkRmlsZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9ncmFtLmNvdmVyYWdlVGVzdCB8fCBwcm9ncmFtLmNvdmVyYWdlVGVzdFBlckZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1J1biBkb2N1bWVudGF0aW9uIGNvdmVyYWdlIHRlc3QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VwZXIudGVzdENvdmVyYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VwZXIuZ2VuZXJhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyLnNldEZpbGVzKHNjYW5uZWRGaWxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvZ3JhbS5jb3ZlcmFnZVRlc3QgfHwgcHJvZ3JhbS5jb3ZlcmFnZVRlc3RQZXJGaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1J1biBkb2N1bWVudGF0aW9uIGNvdmVyYWdlIHRlc3QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlci50ZXN0Q292ZXJhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VwZXIuZ2VuZXJhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS50c2NvbmZpZyAmJiBwcm9ncmFtLmFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIHRzY29uZmlnIGZpbGUgcHJvdmlkZWQgd2l0aCBzb3VyY2UgZm9sZGVyIGluIGFyZ1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGxldCB0ZXN0VHNDb25maWdQYXRoID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS50c2NvbmZpZy5pbmRleE9mKHByb2Nlc3MuY3dkKCkpO1xuICAgICAgICAgICAgICAgIGlmICh0ZXN0VHNDb25maWdQYXRoICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS50c2NvbmZpZy5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5jd2QoKSArIHBhdGguc2VwLFxuICAgICAgICAgICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgc291cmNlRm9sZGVyID0gcHJvZ3JhbS5hcmdzWzBdO1xuICAgICAgICAgICAgICAgIGlmICghRmlsZUVuZ2luZS5leGlzdHNTeW5jKHNvdXJjZUZvbGRlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgYFByb3ZpZGVkIHNvdXJjZSBmb2xkZXIgJHtzb3VyY2VGb2xkZXJ9IHdhcyBub3QgZm91bmQgaW4gdGhlIGN1cnJlbnQgZGlyZWN0b3J5YFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1VzaW5nIHByb3ZpZGVkIHNvdXJjZSBmb2xkZXInKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIUZpbGVFbmdpbmUuZXhpc3RzU3luYyhDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBcIiR7Q29uZmlndXJhdGlvbi5tYWluRGF0YS50c2NvbmZpZ31cIiBmaWxlIHdhcyBub3QgZm91bmQgaW4gdGhlIGN1cnJlbnQgZGlyZWN0b3J5YFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBfZmlsZSA9IHBhdGguam9pbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgcGF0aC5kaXJuYW1lKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWcpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoLmJhc2VuYW1lKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWcpXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXNlIHRoZSBjdXJyZW50IGRpcmVjdG9yeSBvZiB0c2NvbmZpZy5qc29uIGFzIGEgd29ya2luZyBkaXJlY3RvcnlcbiAgICAgICAgICAgICAgICAgICAgICAgIGN3ZCA9IF9maWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGl0KHBhdGguc2VwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zbGljZSgwLCAtMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuam9pbihwYXRoLnNlcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnVXNpbmcgdHNjb25maWcgZmlsZSAnLCBfZmlsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0c0NvbmZpZ0ZpbGUgPSByZWFkQ29uZmlnKF9maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYW5uZWRGaWxlcyA9IHRzQ29uZmlnRmlsZS5maWxlcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY2FubmVkRmlsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FubmVkRmlsZXMgPSBoYW5kbGVQYXRoKHNjYW5uZWRGaWxlcywgY3dkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzY2FubmVkRmlsZXMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhjbHVkZUZpbGVzID0gdHNDb25maWdGaWxlLmV4Y2x1ZGUgfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZUZpbGVzID0gdHNDb25maWdGaWxlLmluY2x1ZGUgfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nhbm5lZEZpbGVzID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXhjbHVkZVBhcnNlciA9IG5ldyBQYXJzZXJVdGlsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVQYXJzZXIgPSBuZXcgUGFyc2VyVXRpbCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhjbHVkZVBhcnNlci5pbml0KGV4Y2x1ZGVGaWxlcywgY3dkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlUGFyc2VyLmluaXQoaW5jbHVkZUZpbGVzLCBjd2QpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0YXJ0Q3dkID0gc291cmNlRm9sZGVyO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGV4Y2x1ZGVQYXJzZXJUZXN0RmlsZXNXaXRoQ3dkRGVwdGggPSBleGNsdWRlUGFyc2VyLnRlc3RGaWxlc1dpdGhDd2REZXB0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXhjbHVkZVBhcnNlclRlc3RGaWxlc1dpdGhDd2REZXB0aC5zdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRDd2QgPSBleGNsdWRlUGFyc2VyLnVwZGF0ZUN3ZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN3ZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVQYXJzZXJUZXN0RmlsZXNXaXRoQ3dkRGVwdGgubGV2ZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluY2x1ZGVQYXJzZXJUZXN0RmlsZXNXaXRoQ3dkRGVwdGggPSBpbmNsdWRlUGFyc2VyLnRlc3RGaWxlc1dpdGhDd2REZXB0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW5jbHVkZVBhcnNlci50ZXN0RmlsZXNXaXRoQ3dkRGVwdGgoKS5zdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRDd2QgPSBpbmNsdWRlUGFyc2VyLnVwZGF0ZUN3ZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN3ZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVQYXJzZXJUZXN0RmlsZXNXaXRoQ3dkRGVwdGgubGV2ZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmluZGVyID0gcmVxdWlyZSgnZmluZGl0MicpKHBhdGgucmVzb2x2ZShzdGFydEN3ZCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluZGVyLm9uKCdkaXJlY3RvcnknLCBmdW5jdGlvbihkaXIsIHN0YXQsIHN0b3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJhc2UgPSBwYXRoLmJhc2VuYW1lKGRpcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiYXNlID09PSAnLmdpdCcgfHwgYmFzZSA9PT0gJ25vZGVfbW9kdWxlcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluZGVyLm9uKCdmaWxlJywgKGZpbGUsIHN0YXQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC8oc3BlY3xcXC5kKVxcLnRzLy50ZXN0KGZpbGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIud2FybignSWdub3JpbmcnLCBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChleGNsdWRlUGFyc2VyLnRlc3RGaWxlKGZpbGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIud2FybignRXhjbHVkaW5nJywgZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5jbHVkZUZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogSWYgaW5jbHVkZSBwcm92aWRlZCBpbiB0c2NvbmZpZywgdXNlIG9ubHkgdGhpcyBzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBhbmQgbm90IGZpbGVzIGZvdW5kIHdpdGggZ2xvYmFsIGZpbmRpdCBzY2FuIGluIHdvcmtpbmcgZGlyZWN0b3J5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoLmV4dG5hbWUoZmlsZSkgPT09ICcudHMnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZVBhcnNlci50ZXN0RmlsZShmaWxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdJbmNsdWRpbmcnLCBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FubmVkRmlsZXMucHVzaChmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhdGguZXh0bmFtZShmaWxlKSA9PT0gJy50cycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4oJ0V4Y2x1ZGluZycsIGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnSW5jbHVkaW5nJywgZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FubmVkRmlsZXMucHVzaChmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluZGVyLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyLnNldEZpbGVzKHNjYW5uZWRGaWxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9ncmFtLmNvdmVyYWdlVGVzdCB8fCBwcm9ncmFtLmNvdmVyYWdlVGVzdFBlckZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdSdW4gZG9jdW1lbnRhdGlvbiBjb3ZlcmFnZSB0ZXN0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlci50ZXN0Q292ZXJhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyLmdlbmVyYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VwZXIuc2V0RmlsZXMoc2Nhbm5lZEZpbGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvZ3JhbS5jb3ZlcmFnZVRlc3QgfHwgcHJvZ3JhbS5jb3ZlcmFnZVRlc3RQZXJGaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdSdW4gZG9jdW1lbnRhdGlvbiBjb3ZlcmFnZSB0ZXN0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyLnRlc3RDb3ZlcmFnZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyLmdlbmVyYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ3RzY29uZmlnLmpzb24gZmlsZSB3YXMgbm90IGZvdW5kLCBwbGVhc2UgdXNlIC1wIGZsYWcnKTtcbiAgICAgICAgICAgICAgICBvdXRwdXRIZWxwKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iXSwibmFtZXMiOlsicGF0aC5yZXNvbHZlIiwicGF0aC5zZXAiLCJwYXRoLmJhc2VuYW1lIiwidHNsaWJfMS5fX2V4dGVuZHMiLCJDT01QT0RPQ19ERUZBVUxUUyIsIkNvbmZpZ3VyYXRpb24iLCJsb2dnZXIiLCJmcy5yZWFkRmlsZVN5bmMiLCJwYXRoLmpvaW4iLCJ0cyIsIkZpbGVFbmdpbmUiLCJBbmd1bGFyVmVyc2lvblV0aWwiLCJJMThuRW5naW5lIiwicGF0aC5kaXJuYW1lIiwicmVhZENvbmZpZyIsImhhbmRsZVBhdGgiLCJwYXRoLmV4dG5hbWUiLCJBcHBsaWNhdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTdCO0lBQUE7UUFHWSxlQUFVLEdBQUcsRUFBRSxDQUFDO0tBMkUzQjtJQXpFVSx5QkFBSSxHQUFYLFVBQVksT0FBaUIsRUFBRSxHQUFXO1FBQ3RDLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNWLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFFekIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNsQixJQUFJLENBQUMsVUFBVSxHQUFPLElBQUksQ0FBQyxVQUFVLFFBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN4RjtLQUNKO0lBRU0sMENBQXFCLEdBQTVCO1FBQ0ksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDN0IsSUFBSSxNQUFNLEdBQUc7WUFDVCxNQUFNLEVBQUUsSUFBSTtZQUNaLEtBQUssRUFBRSxDQUFDO1NBQ1gsQ0FBQztRQUNGLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbEIsSUFBSSxXQUFXLEdBQUdBLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JFLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQ3ZDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO2dCQUN0QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQ2xELElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUU7b0JBQ3RCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO2lCQUN4QjthQUNKO1NBQ0o7UUFDRCxPQUFPLE1BQU0sQ0FBQztLQUNqQjtJQUVNLDhCQUFTLEdBQWhCLFVBQWlCLEdBQUcsRUFBRSxLQUFLO1FBQ3ZCLElBQUksSUFBSSxHQUFHLEdBQUcsRUFDVixPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDNUIsT0FBTyxJQUFJLEtBQUssQ0FBQztTQUNwQjtRQUNELElBQUksR0FBR0QsWUFBWSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNuQyxPQUFPLElBQUksQ0FBQztLQUNmO0lBRU0sNkJBQVEsR0FBZixVQUFnQixJQUFZO1FBQTVCLGlCQStCQztRQTlCRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUM3QixJQUFJLFlBQVksR0FBR0UsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBR0QsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzNELElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQztRQUVuQixJQUFJQSxRQUFRLEtBQUssSUFBSSxFQUFFO1lBQ25CLGFBQWEsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksR0FBR0EsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ2hGO1FBRUQsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNsQixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDN0QsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFBLE9BQU87b0JBQ3BELElBQUksV0FBVyxHQUFHRCxZQUFZLENBQUMsS0FBSSxDQUFDLElBQUksR0FBR0MsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUM5RCxJQUFJLGdCQUFnQixHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLElBQUksR0FBR0EsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUNyRSxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQ3ZDLElBQUksTUFBTSxDQUFDLElBQUksR0FBR0EsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUNoQyxHQUFHLENBQ04sQ0FBQztvQkFDRixPQUFPLGdCQUFnQixLQUFLLGFBQWEsQ0FBQztpQkFDN0MsQ0FBQyxDQUFDO2dCQUNILE1BQU0sR0FBRyxnQkFBZ0IsS0FBSyxDQUFDLENBQUMsQ0FBQzthQUNwQztpQkFBTTtnQkFDSCxNQUFNLEdBQUcsYUFBYSxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDN0M7WUFDRCxJQUFJLE1BQU0sRUFBRTtnQkFDUixNQUFNO2FBQ1Q7U0FDSjtRQUNELE9BQU8sTUFBTSxDQUFDO0tBQ2pCO0lBQ0wsaUJBQUM7Q0FBQSxJQUFBOztBQ2pFRCxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDM0MsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNsQyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN2QyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFckMsSUFBTSxxQkFBcUIsR0FBRyxVQUFVLENBQUM7QUFFekMsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLElBQUksWUFBWSxDQUFDO0FBQ2pCLElBQUksWUFBWSxDQUFDO0FBQ2pCLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUV4QixPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRTNCO0lBQW9DRSw4Q0FBVztJQUEvQzs7S0FxM0JDOzs7O0lBajNCYSw4QkFBSyxHQUFmO1FBQUEsaUJBZzNCQztRQS8yQkcsY0FBYyxHQUFHO1lBQ2IsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3pCO1FBRUQsT0FBTzthQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO2FBQ3BCLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQzthQUN4QixNQUFNLENBQ0gsdUJBQXVCLEVBQ3ZCLDZHQUE2RyxDQUNoSDthQUNBLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRSxzQkFBc0IsQ0FBQzthQUN6RCxNQUFNLENBQ0gsdUJBQXVCLEVBQ3ZCLDRDQUE0QyxFQUM1Q0MsNkJBQWlCLENBQUMsTUFBTSxDQUMzQjthQUNBLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSw2QkFBNkIsQ0FBQzthQUM5RCxNQUFNLENBQUMsbUJBQW1CLEVBQUUscUJBQXFCLEVBQUVBLDZCQUFpQixDQUFDLEtBQUssQ0FBQzthQUMzRSxNQUFNLENBQ0gsNkJBQTZCLEVBQzdCLGtFQUFrRSxDQUNyRTthQUNBLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxrQ0FBa0MsQ0FBQzthQUNoRSxNQUFNLENBQ0gsY0FBYyxFQUNkLDJEQUEyRCxFQUMzRCxLQUFLLENBQ1I7YUFDQSxNQUFNLENBQ0gsYUFBYSxFQUNiLGdFQUFnRSxFQUNoRSxLQUFLLENBQ1I7YUFDQSxNQUFNLENBQUMsZUFBZSxFQUFFLDZCQUE2QixDQUFDO2FBQ3RELE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSw2QkFBNkIsRUFBRUEsNkJBQWlCLENBQUMsSUFBSSxDQUFDO2FBQ2xGLE1BQU0sQ0FDSCxhQUFhLEVBQ2IsZ0VBQWdFLEVBQ2hFLEtBQUssQ0FDUjthQUNBLE1BQU0sQ0FDSCw2QkFBNkIsRUFDN0IseUNBQXlDLEVBQ3pDQSw2QkFBaUIsQ0FBQyxZQUFZLENBQ2pDO2FBQ0EsTUFBTSxDQUFDLGlCQUFpQixFQUFFLHlEQUF5RCxDQUFDO2FBQ3BGLE1BQU0sQ0FDSCx1QkFBdUIsRUFDdkIsNkhBQTZILEVBQzdIQSw2QkFBaUIsQ0FBQyxRQUFRLENBQzdCO2FBQ0EsTUFBTSxDQUNILGlCQUFpQixFQUNqQiw0SEFBNEgsQ0FDL0g7YUFDQSxNQUFNLENBQ0gsaUJBQWlCLEVBQ2pCLDBEQUEwRCxFQUMxRCxLQUFLLENBQ1I7YUFDQSxNQUFNLENBQ0gsMkJBQTJCLEVBQzNCLGdPQUFnTyxFQUNoTyxJQUFJLEVBQ0pBLDZCQUFpQixDQUFDLGVBQWUsQ0FDcEM7YUFDQSxNQUFNLENBQ0gsOEJBQThCLEVBQzlCLDRVQUcwRCxFQUMxRCxJQUFJLEVBQ0osSUFBSSxDQUFDLFNBQVMsQ0FBQ0EsNkJBQWlCLENBQUMsWUFBWSxDQUFDLENBQ2pEO2FBQ0EsTUFBTSxDQUNILHNCQUFzQixFQUN0QiwwRUFBMEUsQ0FDN0U7YUFDQSxNQUFNLENBQUMsbUJBQW1CLEVBQUUsNENBQTRDLENBQUM7YUFDekUsTUFBTSxDQUNILHVCQUF1QixFQUN2QiwrQ0FBK0MsRUFDL0NBLDZCQUFpQixDQUFDLG1CQUFtQixDQUN4QzthQUNBLE1BQU0sQ0FDSCw0QkFBNEIsRUFDNUIsc0VBQXNFLENBQ3pFO2FBQ0EsTUFBTSxDQUNILG9DQUFvQyxFQUNwQyw0RUFBNEUsQ0FDL0U7YUFDQSxNQUFNLENBQ0gsMENBQTBDLEVBQzFDLCtIQUErSCxFQUMvSEEsNkJBQWlCLENBQUMseUJBQXlCLENBQzlDO2FBQ0EsTUFBTSxDQUFDLDhCQUE4QixFQUFFLCtDQUErQyxDQUFDO2FBQ3ZGLE1BQU0sQ0FDSCxtQ0FBbUMsRUFDbkMsNEVBQTRFLENBQy9FO2FBQ0EsTUFBTSxDQUNILHFCQUFxQixFQUNyQixxREFBcUQsRUFDckQsS0FBSyxDQUNSO2FBQ0EsTUFBTSxDQUFDLGtCQUFrQixFQUFFLHlCQUF5QixFQUFFLEtBQUssQ0FBQzthQUM1RCxNQUFNLENBQUMsc0JBQXNCLEVBQUUseUJBQXlCLEVBQUUsS0FBSyxDQUFDO2FBQ2hFLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxzQkFBc0IsRUFBRSxLQUFLLENBQUM7YUFDMUQsTUFBTSxDQUFDLGdCQUFnQixFQUFFLGlDQUFpQyxFQUFFLEtBQUssQ0FBQzthQUNsRSxNQUFNLENBQUMsbUJBQW1CLEVBQUUsOENBQThDLEVBQUUsS0FBSyxDQUFDO2FBQ2xGLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxnREFBZ0QsRUFBRSxLQUFLLENBQUM7YUFDbkYsTUFBTSxDQUFDLG9CQUFvQixFQUFFLGtEQUFrRCxFQUFFLEtBQUssQ0FBQzthQUN2RixNQUFNLENBQUMsbUJBQW1CLEVBQUUsa0RBQWtELEVBQUUsS0FBSyxDQUFDO2FBQ3RGLE1BQU0sQ0FDSCx5QkFBeUIsRUFDekIsZ0VBQWdFLEVBQ2hFLEtBQUssQ0FDUjthQUNBLE1BQU0sQ0FDSCxzQkFBc0IsRUFDdEIsNkJBQTZCLEVBQzdCQSw2QkFBaUIsQ0FBQyxrQkFBa0IsQ0FDdkM7YUFDQSxNQUFNLENBQUMsaUJBQWlCLEVBQUUsNkJBQTZCLEVBQUUsS0FBSyxDQUFDO2FBQy9ELE1BQU0sQ0FDSCx1QkFBdUIsRUFDdkIsa0NBQWtDLEVBQ2xDQSw2QkFBaUIsQ0FBQyxtQkFBbUIsQ0FDeEM7YUFDQSxNQUFNLENBQ0gsV0FBVyxFQUNYLHlFQUF5RSxFQUN6RSxLQUFLLENBQ1I7YUFDQSxNQUFNLENBQUMsd0JBQXdCLEVBQUUsc0JBQXNCLENBQUM7YUFDeEQsTUFBTSxDQUFDLHFCQUFxQixFQUFFLG1CQUFtQixDQUFDO2FBQ2xELE1BQU0sQ0FBQyxhQUFhLEVBQUUsOEJBQThCLENBQUM7YUFDckQsTUFBTSxDQUFDLGlCQUFpQixFQUFFLDRCQUE0QixFQUFFQSw2QkFBaUIsQ0FBQyxNQUFNLENBQUM7YUFDakYsTUFBTSxDQUNILHVDQUF1QyxFQUN2Qyx1RUFBdUUsRUFDdkVBLDZCQUFpQixDQUFDLGdCQUFnQixDQUNyQzthQUNBLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFekIsSUFBSSxVQUFVLEdBQUc7WUFDYixPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDckIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNuQixDQUFDO1FBRUYsSUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFFMUQsSUFBSSxvQkFBb0IsQ0FBQztRQUV6QixJQUFJLFVBQVUsR0FBK0IsRUFBRSxDQUFDO1FBRWhELElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtZQUNoQixJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQ3BDLElBQUksa0JBQWtCLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUM3RCxJQUFJLGtCQUFrQixJQUFJLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3JELGNBQWMsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBR0gsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQ3pFO1lBQ0Qsb0JBQW9CLEdBQUcsY0FBYyxDQUFDLFFBQVEsQ0FBQ0QsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7U0FDaEY7YUFBTTtZQUNILG9CQUFvQixHQUFHLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUN0RDtRQUNELElBQUksb0JBQW9CLEVBQUU7WUFDdEIsSUFBSSxPQUFPLG9CQUFvQixDQUFDLE1BQU0sS0FBSyxXQUFXLEVBQUU7Z0JBQ3BELFVBQVUsR0FBRyxvQkFBb0IsQ0FBQyxNQUFNLENBQUM7YUFDNUM7U0FDSjtRQUVELElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRTtZQUNuQksseUJBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7U0FDckQ7UUFDRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBS0QsNkJBQWlCLENBQUMsTUFBTSxFQUFFO1lBQy9EQyx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztTQUNsRDtRQUVELElBQUksVUFBVSxDQUFDLFFBQVEsRUFBRTtZQUNyQkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUM7U0FDekQ7UUFDRCxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7WUFDbEJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1NBQ3REO1FBRUQsSUFBSSxVQUFVLENBQUMsUUFBUSxFQUFFO1lBQ3JCQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQztTQUN6RDtRQUNELElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtZQUNsQkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7U0FDdEQ7UUFFRCxJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUU7WUFDbEJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO1NBQ25EO1FBQ0QsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ2ZBLHlCQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1NBQ2hEO1FBRUQsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFO1lBQ2pCQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO1NBQ2xFO1FBQ0QsSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUtELDZCQUFpQixDQUFDLEtBQUssRUFBRTtZQUMxREMseUJBQWEsQ0FBQyxRQUFRLENBQUMscUJBQXFCLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztTQUMvRDtRQUVELElBQUksVUFBVSxDQUFDLFlBQVksRUFBRTtZQUN6QkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUM7U0FDakU7UUFDRCxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUU7WUFDdEJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO1NBQzlEO1FBRUQsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFO1lBQ2pCQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztTQUNqRDtRQUNELElBQUksT0FBTyxDQUFDLElBQUksRUFBRTtZQUNkQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztTQUM5QztRQUVELElBQUksVUFBVSxDQUFDLGVBQWUsRUFBRTtZQUM1QkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsZUFBZSxHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUM7U0FDdkU7UUFDRCxJQUNJLE9BQU8sQ0FBQyxlQUFlO1lBQ3ZCLE9BQU8sQ0FBQyxlQUFlLEtBQUtELDZCQUFpQixDQUFDLGVBQWUsRUFDL0Q7WUFDRUMseUJBQWEsQ0FBQyxRQUFRLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUM7U0FDcEU7UUFFRCxJQUFJLFVBQVUsQ0FBQyxTQUFTLEVBQUU7WUFDdEJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDO1NBQzNEO1FBQ0QsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO1lBQ25CQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztTQUN4RDtRQUVELElBQUksVUFBVSxDQUFDLFlBQVksRUFBRTtZQUN6QkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUM7U0FDakU7UUFDRCxJQUNJLE9BQU8sQ0FBQyxZQUFZO1lBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sS0FBS0QsNkJBQWlCLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFDbkY7WUFDRUMseUJBQWEsQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQzFFO1FBRUQsSUFBSSxVQUFVLENBQUMsUUFBUSxFQUFFO1lBQ3JCQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQztTQUN6RDtRQUNELElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtZQUNsQkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7U0FDdEQ7UUFFRCxJQUFJLFVBQVUsQ0FBQyxZQUFZLEVBQUU7WUFDekJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDO1NBQ2pFO1FBQ0QsSUFDSSxPQUFPLENBQUMsWUFBWTtZQUNwQixPQUFPLENBQUMsWUFBWSxLQUFLRCw2QkFBaUIsQ0FBQyxtQkFBbUIsRUFDaEU7WUFDRUMseUJBQWEsQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7U0FDOUQ7UUFFRCxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDbkJDLGtCQUFNLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztTQUN6QjtRQUNELElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtZQUNoQkEsa0JBQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1NBQ3pCO1FBRUQsSUFBSSxVQUFVLENBQUMsS0FBSyxFQUFFO1lBQ2xCRCx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQztTQUNuRDtRQUNELElBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtZQUNmQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztTQUNoRDtRQUVELElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtZQUNqQkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFDOUNBLHlCQUFhLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO1NBQ3JEO1FBQ0QsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO1lBQ2RBLHlCQUFhLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQzNDQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztTQUNsRDtRQUVELElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtZQUNqQkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUM7U0FDakQ7UUFDRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLElBQUksS0FBS0QsNkJBQWlCLENBQUMsSUFBSSxFQUFFO1lBQ3pEQyx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztTQUM5QztRQUVELElBQUksVUFBVSxDQUFDLEtBQUssRUFBRTtZQUNsQkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7U0FDbkQ7UUFDRCxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7WUFDZkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7U0FDaEQ7UUFFRCxJQUFJLFVBQVUsQ0FBQyxZQUFZLEVBQUU7WUFDekJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDO1NBQ2pFO1FBQ0QsSUFBSSxPQUFPLENBQUMsWUFBWSxJQUFJLE9BQU8sQ0FBQyxZQUFZLEtBQUtELDZCQUFpQixDQUFDLFlBQVksRUFBRTtZQUNqRkMseUJBQWEsQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7U0FDOUQ7UUFFRCxJQUFJLFVBQVUsQ0FBQyxhQUFhLEVBQUU7WUFDMUJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDO1NBQ25FO1FBQ0QsSUFBSSxPQUFPLENBQUMsYUFBYSxFQUFFO1lBQ3ZCQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztTQUNoRTtRQUVELElBQUksVUFBVSxDQUFDLFlBQVksRUFBRTtZQUN6QkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztZQUMzQ0EseUJBQWEsQ0FBQyxRQUFRLENBQUMscUJBQXFCO2dCQUN4QyxPQUFPLFVBQVUsQ0FBQyxZQUFZLEtBQUssUUFBUTtzQkFDckMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDO3NCQUNyQ0QsNkJBQWlCLENBQUMsd0JBQXdCLENBQUM7U0FDeEQ7UUFDRCxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUU7WUFDdEJDLHlCQUFhLENBQUMsUUFBUSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDM0NBLHlCQUFhLENBQUMsUUFBUSxDQUFDLHFCQUFxQjtnQkFDeEMsT0FBTyxPQUFPLENBQUMsWUFBWSxLQUFLLFFBQVE7c0JBQ2xDLFFBQVEsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQztzQkFDbENELDZCQUFpQixDQUFDLHdCQUF3QixDQUFDO1NBQ3hEO1FBRUQsSUFBSSxVQUFVLENBQUMsc0JBQXNCLEVBQUU7WUFDbkNDLHlCQUFhLENBQUMsUUFBUSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztZQUNsREEseUJBQWEsQ0FBQyxRQUFRLENBQUMsc0JBQXNCO2dCQUN6QyxPQUFPLFVBQVUsQ0FBQyxzQkFBc0IsS0FBSyxRQUFRO3NCQUMvQyxRQUFRLENBQUMsVUFBVSxDQUFDLHNCQUFzQixFQUFFLEVBQUUsQ0FBQztzQkFDL0NELDZCQUFpQixDQUFDLDZCQUE2QixDQUFDO1NBQzdEO1FBQ0QsSUFBSSxPQUFPLENBQUMsc0JBQXNCLEVBQUU7WUFDaENDLHlCQUFhLENBQUMsUUFBUSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztZQUNsREEseUJBQWEsQ0FBQyxRQUFRLENBQUMsc0JBQXNCO2dCQUN6QyxPQUFPLE9BQU8sQ0FBQyxzQkFBc0IsS0FBSyxRQUFRO3NCQUM1QyxRQUFRLENBQUMsT0FBTyxDQUFDLHNCQUFzQixFQUFFLEVBQUUsQ0FBQztzQkFDNUNELDZCQUFpQixDQUFDLDZCQUE2QixDQUFDO1NBQzdEO1FBRUQsSUFBSSxVQUFVLENBQUMseUJBQXlCLEVBQUU7WUFDdENDLHlCQUFhLENBQUMsUUFBUSxDQUFDLHlCQUF5QjtnQkFDNUMsVUFBVSxDQUFDLHlCQUF5QixLQUFLLE9BQU8sR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQ3ZFO1FBQ0QsSUFBSSxPQUFPLENBQUMseUJBQXlCLEVBQUU7WUFDbkNBLHlCQUFhLENBQUMsUUFBUSxDQUFDLHlCQUF5QjtnQkFDNUMsT0FBTyxDQUFDLHlCQUF5QixLQUFLLE9BQU8sR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQ3BFO1FBRUQsSUFBSSxVQUFVLENBQUMsMEJBQTBCLEVBQUU7WUFDdkNBLHlCQUFhLENBQUMsUUFBUSxDQUFDLDBCQUEwQjtnQkFDN0MsVUFBVSxDQUFDLDBCQUEwQixDQUFDO1NBQzdDO1FBQ0QsSUFBSSxPQUFPLENBQUMsMEJBQTBCLEVBQUU7WUFDcENBLHlCQUFhLENBQUMsUUFBUSxDQUFDLDBCQUEwQixHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQztTQUMxRjtRQUVELElBQUksVUFBVSxDQUFDLGdCQUFnQixFQUFFO1lBQzdCQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7U0FDekU7UUFDRCxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtZQUMxQkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDO1NBQ3RFO1FBRUQsSUFBSSxVQUFVLENBQUMsaUJBQWlCLEVBQUU7WUFDOUJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQztTQUMzRTtRQUNELElBQUksT0FBTyxDQUFDLGlCQUFpQixFQUFFO1lBQzNCQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUM7U0FDeEU7UUFFRCxJQUFJLFVBQVUsQ0FBQyxjQUFjLEVBQUU7WUFDM0JBLHlCQUFhLENBQUMsUUFBUSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUMsY0FBYyxDQUFDO1NBQ3JFO1FBQ0QsSUFBSSxPQUFPLENBQUMsY0FBYyxFQUFFO1lBQ3hCQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztTQUNsRTtRQUVELElBQUksVUFBVSxDQUFDLGtCQUFrQixFQUFFO1lBQy9CQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7U0FDN0U7UUFDRCxJQUFJLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRTtZQUM1QkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDO1NBQzFFO1FBRUQsSUFBSSxVQUFVLENBQUMsZUFBZSxFQUFFO1lBQzVCQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQztTQUN2RTtRQUNELElBQUksT0FBTyxDQUFDLGVBQWUsRUFBRTtZQUN6QkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUM7U0FDcEU7UUFFRCxJQUFJLFVBQVUsQ0FBQyxZQUFZLEVBQUU7WUFDekJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDO1NBQ2pFO1FBQ0QsSUFBSSxPQUFPLENBQUMsWUFBWSxFQUFFO1lBQ3RCQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztTQUM5RDtRQUVELElBQUksVUFBVSxDQUFDLGVBQWUsRUFBRTtZQUM1QkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsZUFBZSxHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUM7U0FDdkU7UUFDRCxJQUFJLE9BQU8sQ0FBQyxlQUFlLEVBQUU7WUFDekJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDO1NBQ3BFO1FBRUQsSUFBSSxVQUFVLENBQUMsY0FBYyxFQUFFO1lBQzNCQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEdBQUcsVUFBVSxDQUFDLGNBQWMsQ0FBQztTQUNyRTtRQUNELElBQUksT0FBTyxDQUFDLGNBQWMsRUFBRTtZQUN4QkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUM7U0FDbEU7UUFFRCxJQUFJLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRTtZQUM3QkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDO1NBQ3pFO1FBQ0QsSUFBSSxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7WUFDMUJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztTQUN0RTtRQUVELElBQUksVUFBVSxDQUFDLGVBQWUsRUFBRTtZQUM1QkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsZUFBZSxHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUM7U0FDdkU7UUFDRCxJQUFJLE9BQU8sQ0FBQyxlQUFlLEVBQUU7WUFDekJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDO1NBQ3BFO1FBRUQsSUFBSSxVQUFVLENBQUMscUJBQXFCLEVBQUU7WUFDbENBLHlCQUFhLENBQUMsUUFBUSxDQUFDLHFCQUFxQixHQUFHLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQztTQUNuRjtRQUNELElBQUksT0FBTyxDQUFDLHFCQUFxQixFQUFFO1lBQy9CQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUM7U0FDaEY7UUFFRCxJQUFJLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRTtZQUMvQkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDO1NBQzdFO1FBQ0QsSUFBSSxPQUFPLENBQUMsa0JBQWtCLEVBQUU7WUFDNUJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztTQUMxRTtRQUVELElBQUksVUFBVSxDQUFDLGFBQWEsRUFBRTtZQUMxQkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsYUFBYSxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUM7U0FDbkU7UUFDRCxJQUFJLE9BQU8sQ0FBQyxhQUFhLEVBQUU7WUFDdkJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDO1NBQ2hFO1FBRUQsSUFBSSxVQUFVLENBQUMsbUJBQW1CLEVBQUU7WUFDaENBLHlCQUFhLENBQUMsUUFBUSxDQUFDLG1CQUFtQixHQUFHLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQztTQUMvRTtRQUNELElBQUksT0FBTyxDQUFDLG1CQUFtQixFQUFFO1lBQzdCQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUM7U0FDNUU7UUFFRCxJQUFJLFVBQVUsQ0FBQyxPQUFPLEVBQUU7WUFDcEJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7WUFDNUNBLHlCQUFhLENBQUMsUUFBUSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztZQUNqREEseUJBQWEsQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztZQUMzQ0EseUJBQWEsQ0FBQyxRQUFRLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztTQUNqRDtRQUNELElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUNqQkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUM1Q0EseUJBQWEsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO1lBQ2pEQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1lBQzNDQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1NBQ2pEO1FBRUQsSUFBSSxVQUFVLENBQUMsYUFBYSxFQUFFO1lBQzFCQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQztTQUNuRTtRQUNELElBQUksT0FBTyxDQUFDLGFBQWEsRUFBRTtZQUN2QkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7U0FDaEU7UUFFRCxJQUFJLFVBQVUsQ0FBQyxVQUFVLEVBQUU7WUFDdkJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDO1NBQzdEO1FBQ0QsSUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFO1lBQ3BCQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztTQUMxRDtRQUVELElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtZQUNqQkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUM7U0FDakQ7UUFDRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7WUFDZEEseUJBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7U0FDOUM7UUFFRCxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDbkJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1NBQ3JEO1FBQ0QsSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUtELDZCQUFpQixDQUFDLE1BQU0sRUFBRTtZQUMvREMseUJBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7U0FDbEQ7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNsQixJQUFJLENBQUNDLGtCQUFNLENBQUMsTUFBTSxFQUFFO2dCQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWEsR0FBRyxDQUFDLE9BQVMsQ0FBQyxDQUFDO2FBQzNDO2lCQUFNO2dCQUNILE9BQU8sQ0FBQyxHQUFHLENBQUNDLGVBQWUsQ0FBQ0MsU0FBUyxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQy9FLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLDJDQUF5Q0MsTUFBRSxDQUFDLE9BQVMsQ0FBQyxDQUFDO2dCQUNuRSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUVoQixJQUFJQyxzQkFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEdBQUdULFFBQVEsR0FBRyxjQUFjLENBQUMsRUFBRTtvQkFDeEQsSUFBTSxXQUFXLEdBQUdTLHNCQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBR1QsUUFBUSxHQUFHLGNBQWMsQ0FBQyxDQUFDO29CQUN4RSxJQUFJLFdBQVcsRUFBRTt3QkFDYixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO3dCQUMzQyxJQUFNLHNCQUFzQixHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUM7d0JBQzFELElBQUksc0JBQXNCLElBQUksc0JBQXNCLENBQUMsVUFBVSxFQUFFOzRCQUM3RCxJQUFNLGdCQUFnQixHQUFHVSw4QkFBa0IsQ0FBQyxZQUFZLENBQ3BELHNCQUFzQixDQUFDLFVBQVUsQ0FDcEMsQ0FBQzs0QkFDRixPQUFPLENBQUMsR0FBRyxDQUNQLDZDQUEyQyxnQkFBa0IsQ0FDaEUsQ0FBQzs0QkFDRixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3lCQUNuQjtxQkFDSjtpQkFDSjtnQkFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUFxQixPQUFPLENBQUMsT0FBUyxDQUFDLENBQUM7Z0JBQ3BELE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXNCLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFHLENBQUMsQ0FBQztnQkFDekUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUNuQjtTQUNKO1FBRUQsSUFBSSxvQkFBb0IsRUFBRTtZQUN0QixJQUFJLE9BQU8sb0JBQW9CLENBQUMsTUFBTSxLQUFLLFdBQVcsRUFBRTtnQkFDcERMLGtCQUFNLENBQUMsSUFBSSxDQUFDLGdDQUE4QixvQkFBb0IsQ0FBQyxRQUFVLENBQUMsQ0FBQzthQUM5RTtTQUNKO1FBRUQsSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQ3ZCQSxrQkFBTSxDQUFDLElBQUksQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO1NBQ3ZFO1FBRUQsSUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLENBQUNNLHNCQUFVLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNuRU4sa0JBQU0sQ0FBQyxJQUFJLENBQ1Asa0JBQWdCLE9BQU8sQ0FBQyxRQUFRLDJDQUFzQ00sc0JBQVUsQ0FBQyxnQkFBa0IsQ0FDdEcsQ0FBQztTQUNMO1FBRUQsSUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sT0FBTyxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7WUFDM0ROLGtCQUFNLENBQUMsS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7WUFDaEQsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNuQjtRQUVELElBQUksVUFBVSxDQUFDLFFBQVEsRUFBRTtZQUNyQkQseUJBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUM7U0FDekQ7UUFDRCxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7WUFDbEJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1NBQ3REO1FBRUQsSUFBSSxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7WUFDMUJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztTQUN0RTtRQUVELElBQUksVUFBVSxDQUFDLEtBQUssRUFBRTtZQUNsQixZQUFZLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQztTQUNuQztRQUNELElBQUksVUFBVSxDQUFDLE9BQU8sRUFBRTtZQUNwQixZQUFZLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQztTQUNyQztRQUNELElBQUksVUFBVSxDQUFDLE9BQU8sRUFBRTtZQUNwQixZQUFZLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQztTQUNyQzs7OztRQUtELElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDcEJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztZQUNqRCxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUU7Z0JBQ2hDLGlCQUFNLFFBQVEsWUFBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ2hDO2lCQUFNO2dCQUNILGlCQUFNLFFBQVEsWUFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDOUI7U0FDSjtRQUVELElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxDQUFDQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTs7WUFFckUsSUFBSSxDQUFDSyxzQkFBVSxDQUFDLFVBQVUsQ0FBQ0wseUJBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3ZEQyxrQkFBTSxDQUFDLEtBQUssQ0FBSUQseUJBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSwwQkFBdUIsQ0FBQyxDQUFDO2dCQUN0RSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ25CO2lCQUFNO2dCQUNIQyxrQkFBTSxDQUFDLElBQUksQ0FDUCxnQ0FBOEJELHlCQUFhLENBQUMsUUFBUSxDQUFDLE1BQU0sbUJBQWNBLHlCQUFhLENBQUMsUUFBUSxDQUFDLFFBQVEsU0FBSSxPQUFPLENBQUMsSUFBTSxDQUM3SCxDQUFDO2dCQUNGLGlCQUFNLFlBQVksWUFBQ0EseUJBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDckQ7U0FDSjthQUFNLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxDQUFDQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFOztZQUU3RSxJQUFJLENBQUNLLHNCQUFVLENBQUMsVUFBVSxDQUFDTCx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDdkRDLGtCQUFNLENBQUMsS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7Z0JBQzdELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbkI7aUJBQU07Z0JBQ0hBLGtCQUFNLENBQUMsSUFBSSxDQUNQLGdDQUE4QkQseUJBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxtQkFBY0EseUJBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxTQUFJLE9BQU8sQ0FBQyxJQUFNLENBQzdILENBQUM7Z0JBQ0YsaUJBQU0sWUFBWSxZQUFDQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUNyRDtTQUNKO2FBQU0sSUFBSUEseUJBQWEsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEVBQUU7WUFDbEQsSUFBSSxPQUFPLENBQUMsc0JBQXNCLEVBQUU7Z0JBQ2hDQyxrQkFBTSxDQUFDLElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO2dCQUN6RCxpQkFBTSxZQUFZLFdBQUUsQ0FBQzthQUN4QjtpQkFBTTtnQkFDSEEsa0JBQU0sQ0FBQyxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzthQUNsRDtTQUNKO2FBQU07WUFDSCxJQUFJLE9BQU8sQ0FBQyxhQUFhLEVBQUU7Z0JBQ3ZCRCx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2FBQy9DO1lBRUQsSUFBSUEseUJBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTs7OztnQkFJOUQsSUFBSSxnQkFBZ0IsR0FBR0EseUJBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDOUUsSUFBSSxnQkFBZ0IsS0FBSyxDQUFDLENBQUMsRUFBRTtvQkFDekJBLHlCQUFhLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBR0EseUJBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FDckUsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHSixRQUFRLEVBQ3hCLEVBQUUsQ0FDTCxDQUFDO2lCQUNMO2dCQUVELElBQUksQ0FBQ1Msc0JBQVUsQ0FBQyxVQUFVLENBQUNMLHlCQUFhLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUN6REMsa0JBQU0sQ0FBQyxLQUFLLENBQ1IsT0FBSUQseUJBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxtREFBK0MsQ0FDckYsQ0FBQztvQkFDRixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNuQjtxQkFBTTtvQkFDSCxJQUFJLEtBQUssR0FBR0csU0FBUyxDQUNqQkEsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRUssWUFBWSxDQUFDUix5QkFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUN2RUgsYUFBYSxDQUFDRyx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FDakQsQ0FBQzs7b0JBRUYsR0FBRyxHQUFHLEtBQUs7eUJBQ04sS0FBSyxDQUFDSixRQUFRLENBQUM7eUJBQ2YsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt5QkFDWixJQUFJLENBQUNBLFFBQVEsQ0FBQyxDQUFDO29CQUNwQkssa0JBQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBRTNDLElBQUksWUFBWSxHQUFHUSxzQkFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNyQyxZQUFZLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQztvQkFDbEMsSUFBSSxZQUFZLEVBQUU7d0JBQ2QsWUFBWSxHQUFHQyxzQkFBVSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDaEQ7b0JBRUQsSUFBSSxPQUFPLFlBQVksS0FBSyxXQUFXLEVBQUU7d0JBQ3JDLFlBQVksR0FBRyxZQUFZLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQzt3QkFDMUMsWUFBWSxHQUFHLFlBQVksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO3dCQUMxQyxZQUFZLEdBQUcsRUFBRSxDQUFDO3dCQUVsQixJQUFJLGVBQWEsR0FBRyxJQUFJLFVBQVUsRUFBRSxFQUNoQyxlQUFhLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQzt3QkFFckMsZUFBYSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ3RDLGVBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUV0QyxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUM7d0JBRW5CLElBQUksa0NBQWtDLEdBQUcsZUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUM7d0JBQy9FLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxNQUFNLEVBQUU7NEJBQzVDLFFBQVEsR0FBRyxlQUFhLENBQUMsU0FBUyxDQUM5QixHQUFHLEVBQ0gsa0NBQWtDLENBQUMsS0FBSyxDQUMzQyxDQUFDO3lCQUNMO3dCQUNELElBQUksa0NBQWtDLEdBQUcsZUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUM7d0JBQy9FLElBQUksQ0FBQyxlQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxNQUFNLEVBQUU7NEJBQy9DLFFBQVEsR0FBRyxlQUFhLENBQUMsU0FBUyxDQUM5QixHQUFHLEVBQ0gsa0NBQWtDLENBQUMsS0FBSyxDQUMzQyxDQUFDO3lCQUNMO3dCQUVELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLElBQUksR0FBRyxDQUFDLENBQUM7d0JBRWpELE1BQU0sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQVMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJOzRCQUMzQyxJQUFJLElBQUksR0FBR2IsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUM5QixJQUFJLElBQUksS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLGNBQWMsRUFBRTtnQ0FDNUMsSUFBSSxFQUFFLENBQUM7NkJBQ1Y7eUJBQ0osQ0FBQyxDQUFDO3dCQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsSUFBSSxFQUFFLElBQUk7NEJBQ3pCLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dDQUM3Qkksa0JBQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDOzZCQUNqQztpQ0FBTSxJQUNILGVBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO2dDQUM1QlUsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssRUFDOUI7Z0NBQ0VWLGtCQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQzs2QkFDbEM7aUNBQU0sSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs7Ozs7Z0NBS2hDLElBQUlVLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksZUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQ0FDOURWLGtCQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztvQ0FDaEMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQ0FDM0I7cUNBQU07b0NBQ0gsSUFBSVUsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssRUFBRTt3Q0FDOUJWLGtCQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztxQ0FDbEM7aUNBQ0o7NkJBQ0o7aUNBQU07Z0NBQ0hBLGtCQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztnQ0FDaEMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs2QkFDM0I7eUJBQ0osQ0FBQyxDQUFDO3dCQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFOzRCQUNiLGlCQUFNLFFBQVEsYUFBQyxZQUFZLENBQUMsQ0FBQzs0QkFDN0IsSUFBSSxPQUFPLENBQUMsWUFBWSxJQUFJLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRTtnQ0FDckRBLGtCQUFNLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7Z0NBQy9DLGlCQUFNLFlBQVksWUFBRSxDQUFDOzZCQUN4QjtpQ0FBTTtnQ0FDSCxpQkFBTSxRQUFRLFlBQUUsQ0FBQzs2QkFDcEI7eUJBQ0osQ0FBQyxDQUFDO3FCQUNOO3lCQUFNO3dCQUNILGlCQUFNLFFBQVEsWUFBQyxZQUFZLENBQUMsQ0FBQzt3QkFDN0IsSUFBSSxPQUFPLENBQUMsWUFBWSxJQUFJLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRTs0QkFDckRBLGtCQUFNLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7NEJBQy9DLGlCQUFNLFlBQVksV0FBRSxDQUFDO3lCQUN4Qjs2QkFBTTs0QkFDSCxpQkFBTSxRQUFRLFdBQUUsQ0FBQzt5QkFDcEI7cUJBQ0o7aUJBQ0o7YUFDSjtpQkFBTSxJQUFJRCx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOzs7O2dCQUluRSxJQUFJLGdCQUFnQixHQUFHQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUM5RSxJQUFJLGdCQUFnQixLQUFLLENBQUMsQ0FBQyxFQUFFO29CQUN6QkEseUJBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHQSx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUNyRSxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUdKLFFBQVEsRUFDeEIsRUFBRSxDQUNMLENBQUM7aUJBQ0w7Z0JBRUQsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxDQUFDUyxzQkFBVSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsRUFBRTtvQkFDdENKLGtCQUFNLENBQUMsS0FBSyxDQUNSLDRCQUEwQixZQUFZLDRDQUF5QyxDQUNsRixDQUFDO29CQUNGLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ25CO3FCQUFNO29CQUNIQSxrQkFBTSxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO29CQUU1QyxJQUFJLENBQUNJLHNCQUFVLENBQUMsVUFBVSxDQUFDTCx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTt3QkFDekRDLGtCQUFNLENBQUMsS0FBSyxDQUNSLE9BQUlELHlCQUFhLENBQUMsUUFBUSxDQUFDLFFBQVEsbURBQStDLENBQ3JGLENBQUM7d0JBQ0YsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDbkI7eUJBQU07d0JBQ0gsSUFBSSxLQUFLLEdBQUdHLFNBQVMsQ0FDakJBLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUVLLFlBQVksQ0FBQ1IseUJBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsRUFDdkVILGFBQWEsQ0FBQ0cseUJBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQ2pELENBQUM7O3dCQUVGLEdBQUcsR0FBRyxLQUFLOzZCQUNOLEtBQUssQ0FBQ0osUUFBUSxDQUFDOzZCQUNmLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7NkJBQ1osSUFBSSxDQUFDQSxRQUFRLENBQUMsQ0FBQzt3QkFDcEJLLGtCQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUUzQyxJQUFJLFlBQVksR0FBR1Esc0JBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDckMsWUFBWSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUM7d0JBQ2xDLElBQUksWUFBWSxFQUFFOzRCQUNkLFlBQVksR0FBR0Msc0JBQVUsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7eUJBQ2hEO3dCQUVELElBQUksT0FBTyxZQUFZLEtBQUssV0FBVyxFQUFFOzRCQUNyQyxZQUFZLEdBQUcsWUFBWSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7NEJBQzFDLFlBQVksR0FBRyxZQUFZLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQzs0QkFDMUMsWUFBWSxHQUFHLEVBQUUsQ0FBQzs0QkFFbEIsSUFBSSxlQUFhLEdBQUcsSUFBSSxVQUFVLEVBQUUsRUFDaEMsZUFBYSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7NEJBRXJDLGVBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDOzRCQUN0QyxlQUFhLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQzs0QkFFdEMsSUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDOzRCQUU1QixJQUFJLGtDQUFrQyxHQUFHLGVBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDOzRCQUMvRSxJQUFJLENBQUMsa0NBQWtDLENBQUMsTUFBTSxFQUFFO2dDQUM1QyxRQUFRLEdBQUcsZUFBYSxDQUFDLFNBQVMsQ0FDOUIsR0FBRyxFQUNILGtDQUFrQyxDQUFDLEtBQUssQ0FDM0MsQ0FBQzs2QkFDTDs0QkFDRCxJQUFJLGtDQUFrQyxHQUFHLGVBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDOzRCQUMvRSxJQUFJLENBQUMsZUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUMsTUFBTSxFQUFFO2dDQUMvQyxRQUFRLEdBQUcsZUFBYSxDQUFDLFNBQVMsQ0FDOUIsR0FBRyxFQUNILGtDQUFrQyxDQUFDLEtBQUssQ0FDM0MsQ0FBQzs2QkFDTDs0QkFFRCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUNmLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOzRCQUV4RCxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFTLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSTtnQ0FDM0MsSUFBSSxJQUFJLEdBQUdFLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQ0FDOUIsSUFBSSxJQUFJLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxjQUFjLEVBQUU7b0NBQzVDLElBQUksRUFBRSxDQUFDO2lDQUNWOzZCQUNKLENBQUMsQ0FBQzs0QkFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFDLElBQUksRUFBRSxJQUFJO2dDQUN6QixJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtvQ0FDN0JJLGtCQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztpQ0FDakM7cUNBQU0sSUFBSSxlQUFhLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO29DQUNyQ0Esa0JBQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO2lDQUNsQztxQ0FBTSxJQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOzs7OztvQ0FLaEMsSUFDSVUsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUs7d0NBQzVCLGVBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQzlCO3dDQUNFVixrQkFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7d0NBQ2hDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7cUNBQzNCO3lDQUFNO3dDQUNILElBQUlVLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLEVBQUU7NENBQzlCVixrQkFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7eUNBQ2xDO3FDQUNKO2lDQUNKO3FDQUFNO29DQUNIQSxrQkFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7b0NBQ2hDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUNBQzNCOzZCQUNKLENBQUMsQ0FBQzs0QkFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRTtnQ0FDYixpQkFBTSxRQUFRLGFBQUMsWUFBWSxDQUFDLENBQUM7Z0NBQzdCLElBQUksT0FBTyxDQUFDLFlBQVksSUFBSSxPQUFPLENBQUMsbUJBQW1CLEVBQUU7b0NBQ3JEQSxrQkFBTSxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO29DQUMvQyxpQkFBTSxZQUFZLFlBQUUsQ0FBQztpQ0FDeEI7cUNBQU07b0NBQ0gsaUJBQU0sUUFBUSxZQUFFLENBQUM7aUNBQ3BCOzZCQUNKLENBQUMsQ0FBQzt5QkFDTjs2QkFBTTs0QkFDSCxpQkFBTSxRQUFRLFlBQUMsWUFBWSxDQUFDLENBQUM7NEJBQzdCLElBQUksT0FBTyxDQUFDLFlBQVksSUFBSSxPQUFPLENBQUMsbUJBQW1CLEVBQUU7Z0NBQ3JEQSxrQkFBTSxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO2dDQUMvQyxpQkFBTSxZQUFZLFdBQUUsQ0FBQzs2QkFDeEI7aUNBQU07Z0NBQ0gsaUJBQU0sUUFBUSxXQUFFLENBQUM7NkJBQ3BCO3lCQUNKO3FCQUNKO2lCQUNKO2FBQ0o7aUJBQU07Z0JBQ0hBLGtCQUFNLENBQUMsS0FBSyxDQUFDLHNEQUFzRCxDQUFDLENBQUM7Z0JBQ3JFLFVBQVUsRUFBRSxDQUFDO2FBQ2hCO1NBQ0o7S0FDSjtJQUNMLHFCQUFDO0NBcjNCRCxDQUFvQ1csdUJBQVc7Ozs7In0=
