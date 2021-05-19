"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors = require("../../errors");
var fileSystem_1 = require("../../fileSystem");
var manipulation_1 = require("../../manipulation");
var typescript_1 = require("../../typescript");
var utils_1 = require("../../utils");
var Program_1 = require("./Program");
var results_1 = require("./results");
var LanguageService = /** @class */ (function () {
    /** @internal */
    function LanguageService(global) {
        var _this = this;
        this.global = global;
        // I don't know what I'm doing for some of this...
        var version = 0;
        var fileExistsSync = function (path) { return _this.global.compilerFactory.containsSourceFileAtPath(path) || global.fileSystemWrapper.fileExistsSync(path); };
        var languageServiceHost = {
            getCompilationSettings: function () { return global.compilerOptions.get(); },
            getNewLine: function () { return global.manipulationSettings.getNewLineKindAsString(); },
            getScriptFileNames: function () { return _this.global.compilerFactory.getSourceFilePaths(); },
            getScriptVersion: function (fileName) {
                return (version++).toString();
            },
            getScriptSnapshot: function (fileName) {
                if (!fileExistsSync(fileName))
                    return undefined;
                return typescript_1.ts.ScriptSnapshot.fromString(_this.global.compilerFactory.addOrGetSourceFileFromFilePath(fileName, {}).getFullText());
            },
            getCurrentDirectory: function () { return global.fileSystemWrapper.getCurrentDirectory(); },
            getDefaultLibFileName: function (options) {
                if (_this.global.fileSystemWrapper.getFileSystem() instanceof fileSystem_1.DefaultFileSystemHost)
                    return typescript_1.ts.getDefaultLibFilePath(global.compilerOptions.get());
                else
                    return utils_1.FileUtils.pathJoin(global.fileSystemWrapper.getCurrentDirectory(), "node_modules/typescript/lib/" + typescript_1.ts.getDefaultLibFileName(global.compilerOptions.get()));
            },
            useCaseSensitiveFileNames: function () { return true; },
            readFile: function (path, encoding) {
                if (_this.global.compilerFactory.containsSourceFileAtPath(path))
                    return _this.global.compilerFactory.getSourceFileFromCacheFromFilePath(path).getFullText();
                return _this.global.fileSystemWrapper.readFileSync(path, encoding);
            },
            fileExists: fileExistsSync,
            directoryExists: function (dirName) { return _this.global.compilerFactory.containsDirectoryAtPath(dirName) || _this.global.fileSystemWrapper.directoryExistsSync(dirName); }
        };
        this.compilerHost = {
            getSourceFile: function (fileName, languageVersion, onError) {
                var sourceFile = _this.global.compilerFactory.addOrGetSourceFileFromFilePath(fileName, { languageVersion: languageVersion });
                return sourceFile == null ? undefined : sourceFile.compilerNode;
            },
            // getSourceFileByPath: (...) => {}, // not providing these will force it to use the file name as the file path
            // getDefaultLibLocation: (...) => {},
            getDefaultLibFileName: function (options) { return languageServiceHost.getDefaultLibFileName(options); },
            writeFile: function (filePath, data, writeByteOrderMark, onError, sourceFiles) {
                _this.global.fileSystemWrapper.writeFileSync(filePath, data);
            },
            getCurrentDirectory: function () { return languageServiceHost.getCurrentDirectory(); },
            getDirectories: function (path) {
                // todo: not sure where this is used...
                return [];
            },
            fileExists: function (fileName) { return languageServiceHost.fileExists(fileName); },
            readFile: function (fileName) { return languageServiceHost.readFile(fileName); },
            getCanonicalFileName: function (fileName) { return _this.global.fileSystemWrapper.getStandardizedAbsolutePath(fileName); },
            useCaseSensitiveFileNames: function () { return languageServiceHost.useCaseSensitiveFileNames(); },
            getNewLine: function () { return languageServiceHost.getNewLine(); },
            getEnvironmentVariable: function (name) { return process.env[name]; }
        };
        this._compilerObject = typescript_1.ts.createLanguageService(languageServiceHost);
        this.program = new Program_1.Program(this.global, this.global.compilerFactory.getSourceFilePaths(), this.compilerHost);
        this.global.compilerFactory.onSourceFileAdded(function () { return _this.resetProgram(); });
        this.global.compilerFactory.onSourceFileRemoved(function () { return _this.resetProgram(); });
    }
    Object.defineProperty(LanguageService.prototype, "compilerObject", {
        /**
         * Gets the compiler language service.
         */
        get: function () {
            return this._compilerObject;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Resets the program. This should be done whenever any modifications happen.
     * @internal
     */
    LanguageService.prototype.resetProgram = function () {
        this.program.reset(this.global.compilerFactory.getSourceFilePaths(), this.compilerHost);
    };
    /**
     * Gets the language service's program.
     */
    LanguageService.prototype.getProgram = function () {
        return this.program;
    };
    /**
     * Rename the specified node.
     * @param node - Node to rename.
     * @param newName - New name for the node.
     */
    LanguageService.prototype.renameNode = function (node, newName) {
        errors.throwIfNotStringOrWhitespace(newName, "newName");
        if (node.getText() === newName)
            return;
        this.renameLocations(this.findRenameLocations(node), newName);
    };
    /**
     * Rename the provided rename locations.
     * @param renameLocations - Rename locations.
     * @param newName - New name for the node.
     */
    LanguageService.prototype.renameLocations = function (renameLocations, newName) {
        var e_1, _a, e_2, _b;
        var renameLocationsBySourceFile = new utils_1.KeyValueCache();
        try {
            for (var renameLocations_1 = tslib_1.__values(renameLocations), renameLocations_1_1 = renameLocations_1.next(); !renameLocations_1_1.done; renameLocations_1_1 = renameLocations_1.next()) {
                var renameLocation = renameLocations_1_1.value;
                var locations = renameLocationsBySourceFile.getOrCreate(renameLocation.getSourceFile(), function () { return []; });
                locations.push(renameLocation);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (renameLocations_1_1 && !renameLocations_1_1.done && (_a = renameLocations_1.return)) _a.call(renameLocations_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _c = tslib_1.__values(renameLocationsBySourceFile.getEntries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = tslib_1.__read(_d.value, 2), sourceFile = _e[0], locations = _e[1];
                manipulation_1.replaceSourceFileTextForRename({
                    sourceFile: sourceFile,
                    renameLocations: locations,
                    newName: newName
                });
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    /**
     * Gets the definitions for the specified node.
     * @param node - Node.
     */
    LanguageService.prototype.getDefinitions = function (node) {
        return this.getDefinitionsAtPosition(node.sourceFile, node.getStart());
    };
    /**
     * Gets the definitions at the specified position.
     * @param sourceFile - Source file.
     * @param pos - Position.
     */
    LanguageService.prototype.getDefinitionsAtPosition = function (sourceFile, pos) {
        var _this = this;
        var results = this.compilerObject.getDefinitionAtPosition(sourceFile.getFilePath(), pos) || [];
        return results.map(function (info) { return _this.global.compilerFactory.getDefinitionInfo(info); });
    };
    /**
     * Gets the implementations for the specified node.
     * @param node - Node.
     */
    LanguageService.prototype.getImplementations = function (node) {
        return this.getImplementationsAtPosition(node.sourceFile, node.getStart());
    };
    /**
     * Gets the implementations at the specified position.
     * @param sourceFile - Source file.
     * @param pos - Position.
     */
    LanguageService.prototype.getImplementationsAtPosition = function (sourceFile, pos) {
        var _this = this;
        var results = this.compilerObject.getImplementationAtPosition(sourceFile.getFilePath(), pos) || [];
        return results.map(function (location) { return new results_1.ImplementationLocation(_this.global, location); });
    };
    /**
     * Finds references based on the specified node.
     * @param node - Node to find references for.
     */
    LanguageService.prototype.findReferences = function (node) {
        return this.findReferencesAtPosition(node.sourceFile, node.getStart());
    };
    /**
     * Finds the nodes that reference the definition(s) of the specified node.
     * @param node - Node.
     */
    LanguageService.prototype.findReferencesAsNodes = function (node) {
        var references = this.findReferences(node);
        return utils_1.ArrayUtils.from(getReferencingNodes());
        function getReferencingNodes() {
            var e_3, _a, e_4, _b, references_1, references_1_1, referenceSymbol, isAlias, _c, _d, reference, e_4_1, e_3_1;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 11, 12, 13]);
                        references_1 = tslib_1.__values(references), references_1_1 = references_1.next();
                        _e.label = 1;
                    case 1:
                        if (!!references_1_1.done) return [3 /*break*/, 10];
                        referenceSymbol = references_1_1.value;
                        isAlias = referenceSymbol.getDefinition().getKind() === typescript_1.ts.ScriptElementKind.alias;
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 7, 8, 9]);
                        _c = tslib_1.__values(referenceSymbol.getReferences()), _d = _c.next();
                        _e.label = 3;
                    case 3:
                        if (!!_d.done) return [3 /*break*/, 6];
                        reference = _d.value;
                        if (!(isAlias || !reference.isDefinition())) return [3 /*break*/, 5];
                        return [4 /*yield*/, reference.getNode()];
                    case 4:
                        _e.sent();
                        _e.label = 5;
                    case 5:
                        _d = _c.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_4_1 = _e.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                        }
                        finally { if (e_4) throw e_4.error; }
                        return [7 /*endfinally*/];
                    case 9:
                        references_1_1 = references_1.next();
                        return [3 /*break*/, 1];
                    case 10: return [3 /*break*/, 13];
                    case 11:
                        e_3_1 = _e.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 13];
                    case 12:
                        try {
                            if (references_1_1 && !references_1_1.done && (_a = references_1.return)) _a.call(references_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        }
    };
    /**
     * Finds references based on the specified position.
     * @param sourceFile - Source file.
     * @param pos - Position to find the reference at.
     */
    LanguageService.prototype.findReferencesAtPosition = function (sourceFile, pos) {
        var _this = this;
        var results = this.compilerObject.findReferences(sourceFile.getFilePath(), pos) || [];
        return results.map(function (s) { return _this.global.compilerFactory.getReferencedSymbol(s); });
    };
    /**
     * Find the rename locations for the specified node.
     * @param node - Node to get the rename locations for.
     */
    LanguageService.prototype.findRenameLocations = function (node) {
        var _this = this;
        var sourceFile = node.getSourceFile();
        var renameLocations = this.compilerObject.findRenameLocations(sourceFile.getFilePath(), node.getStart(), false, false) || [];
        return renameLocations.map(function (l) { return new results_1.RenameLocation(_this.global, l); });
    };
    /**
     * Gets the formatting edits for a range.
     * @param filePath - File path.
     * @param range - Position range.
     * @param settings - Settings.
     */
    LanguageService.prototype.getFormattingEditsForRange = function (filePath, range, settings) {
        return (this.compilerObject.getFormattingEditsForRange(filePath, range[0], range[1], this._getFilledSettings(settings)) || []).map(function (e) { return new results_1.TextChange(e); });
    };
    /**
     * Gets the formatting edits for a document.
     * @param filePath - File path of the source file.
     * @param settings - Format code settings.
     */
    LanguageService.prototype.getFormattingEditsForDocument = function (filePath, settings) {
        return (this.compilerObject.getFormattingEditsForDocument(filePath, this._getFilledSettings(settings)) || []).map(function (e) { return new results_1.TextChange(e); });
    };
    /**
     * Gets the formatted text for a document.
     * @param filePath - File path of the source file.
     * @param settings - Format code settings.
     */
    LanguageService.prototype.getFormattedDocumentText = function (filePath, settings) {
        var sourceFile = this.global.compilerFactory.getSourceFileFromCacheFromFilePath(filePath);
        if (sourceFile == null)
            throw new errors.FileNotFoundError(filePath);
        settings = this._getFilledSettings(settings);
        var formattingEdits = this.getFormattingEditsForDocument(filePath, settings);
        var newText = manipulation_1.getTextFromFormattingEdits(sourceFile, formattingEdits);
        var newLineChar = settings.newLineCharacter;
        if (settings.ensureNewLineAtEndOfFile && !utils_1.StringUtils.endsWith(newText, newLineChar))
            newText += newLineChar;
        return newText.replace(/\r?\n/g, newLineChar);
    };
    LanguageService.prototype.getEmitOutput = function (filePathOrSourceFile, emitOnlyDtsFiles) {
        var filePath = this._getFilePathFromFilePathOrSourceFile(filePathOrSourceFile);
        return new results_1.EmitOutput(this.global, filePath, this.compilerObject.getEmitOutput(filePath, emitOnlyDtsFiles));
    };
    LanguageService.prototype.getIdentationAtPosition = function (filePathOrSourceFile, position, settings) {
        var filePath = this._getFilePathFromFilePathOrSourceFile(filePathOrSourceFile);
        if (settings == null)
            settings = this.global.manipulationSettings.getEditorSettings();
        else
            utils_1.fillDefaultEditorSettings(settings, this.global.manipulationSettings);
        return this.compilerObject.getIndentationAtPosition(filePath, position, settings);
    };
    LanguageService.prototype.organizeImports = function (filePathOrSourceFile, settings, userPreferences) {
        if (settings === void 0) { settings = {}; }
        if (userPreferences === void 0) { userPreferences = {}; }
        var scope = {
            type: "file",
            fileName: this._getFilePathFromFilePathOrSourceFile(filePathOrSourceFile)
        };
        return this.compilerObject.organizeImports(scope, this._getFilledSettings(settings), this._getFilledUserPreferences(userPreferences))
            .map(function (fileTextChanges) { return new results_1.FileTextChanges(fileTextChanges); });
    };
    LanguageService.prototype._getFilePathFromFilePathOrSourceFile = function (filePathOrSourceFile) {
        var filePath = typeof filePathOrSourceFile === "string"
            ? this.global.fileSystemWrapper.getStandardizedAbsolutePath(filePathOrSourceFile)
            : filePathOrSourceFile.getFilePath();
        if (!this.global.compilerFactory.containsSourceFileAtPath(filePath))
            throw new errors.FileNotFoundError(filePath);
        return filePath;
    };
    LanguageService.prototype._getFilledSettings = function (settings) {
        if (settings["_filled"]) // optimization
            return settings;
        settings = utils_1.ObjectUtils.assign(this.global.getFormatCodeSettings(), settings);
        utils_1.fillDefaultFormatCodeSettings(settings, this.global.manipulationSettings);
        settings["_filled"] = true;
        return settings;
    };
    LanguageService.prototype._getFilledUserPreferences = function (userPreferences) {
        return utils_1.ObjectUtils.assign(this.global.getUserPreferences(), userPreferences);
    };
    return LanguageService;
}());
exports.LanguageService = LanguageService;
