"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var compiler_1 = require("../compiler");
var errors = require("../errors");
var typescript_1 = require("../typescript");
var utils_1 = require("../utils");
var createTempSourceFile_1 = require("./createTempSourceFile");
var DirectoryCache_1 = require("./DirectoryCache");
var ForgetfulNodeCache_1 = require("./ForgetfulNodeCache");
var kindToWrapperMappings_1 = require("./kindToWrapperMappings");
/**
 * Factory for creating compiler wrappers.
 * @internal
 */
var CompilerFactory = /** @class */ (function () {
    /**
     * Initializes a new instance of CompilerFactory.
     * @param global - Global container.
     */
    function CompilerFactory(global) {
        this.global = global;
        this.sourceFileCacheByFilePath = new utils_1.KeyValueCache();
        this.diagnosticCache = new utils_1.WeakCache();
        this.definitionInfoCache = new utils_1.WeakCache();
        this.documentSpanCache = new utils_1.WeakCache();
        this.diagnosticMessageChainCache = new utils_1.WeakCache();
        this.jsDocTagInfoCache = new utils_1.WeakCache();
        this.signatureCache = new utils_1.WeakCache();
        this.symbolCache = new utils_1.WeakCache();
        this.symbolDisplayPartCache = new utils_1.WeakCache();
        this.referenceEntryCache = new utils_1.WeakCache();
        this.referencedSymbolCache = new utils_1.WeakCache();
        this.referencedSymbolDefinitionInfoCache = new utils_1.WeakCache();
        this.typeCache = new utils_1.WeakCache();
        this.typeParameterCache = new utils_1.WeakCache();
        this.nodeCache = new ForgetfulNodeCache_1.ForgetfulNodeCache();
        this.sourceFileAddedEventContainer = new utils_1.EventContainer();
        this.sourceFileMovedEventContainer = new utils_1.EventContainer();
        this.sourceFileRemovedEventContainer = new utils_1.EventContainer();
        this.directoryCache = new DirectoryCache_1.DirectoryCache(global);
    }
    /**
     * Gets all the source files sorted by their directory depth.
     */
    CompilerFactory.prototype.getSourceFilesByDirectoryDepth = function () {
        var e_1, _a, _b, _c, dir, e_1_1;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, 6, 7]);
                    _b = tslib_1.__values(this.getDirectoriesByDepth()), _c = _b.next();
                    _d.label = 1;
                case 1:
                    if (!!_c.done) return [3 /*break*/, 4];
                    dir = _c.value;
                    return [5 /*yield**/, tslib_1.__values(dir.getSourceFiles())];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    _c = _b.next();
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 7];
                case 5:
                    e_1_1 = _d.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 7];
                case 6:
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    };
    /**
     * Gets the source file paths from the internal cache.
     */
    CompilerFactory.prototype.getSourceFilePaths = function () {
        return utils_1.ArrayUtils.from(this.sourceFileCacheByFilePath.getKeys());
    };
    /**
     * Gets the child directories of a directory.
     * @param dirPath - Directory path.
     */
    CompilerFactory.prototype.getChildDirectoriesOfDirectory = function (dirPath) {
        return this.directoryCache.getChildDirectoriesOfDirectory(dirPath);
    };
    /**
     * Gets the child source files of a directory.
     * @param dirPath - Directory path.
     */
    CompilerFactory.prototype.getChildSourceFilesOfDirectory = function (dirPath) {
        return this.directoryCache.getChildSourceFilesOfDirectory(dirPath);
    };
    /**
     * Occurs when a source file is added to the cache.
     * @param subscription - Subscripton.
     * @param subscribe - Whether to subscribe or unsubscribe (default to true).
     */
    CompilerFactory.prototype.onSourceFileAdded = function (subscription, subscribe) {
        if (subscribe === void 0) { subscribe = true; }
        if (subscribe)
            this.sourceFileAddedEventContainer.subscribe(subscription);
        else
            this.sourceFileAddedEventContainer.unsubscribe(subscription);
    };
    /**
     * Occurs when a source file is removed from the cache.
     * @param subscription - Subscripton.
     */
    CompilerFactory.prototype.onSourceFileRemoved = function (subscription) {
        this.sourceFileRemovedEventContainer.subscribe(subscription);
    };
    /**
     * Adds a source file by structure or text.
     * @param filePath - File path.
     * @param structureOrText - Structure or text.
     * @param options - Options.
     */
    CompilerFactory.prototype.createSourceFile = function (filePath, structureOrText, options) {
        if (structureOrText == null || typeof structureOrText === "string")
            return this.createSourceFileFromText(filePath, structureOrText || "", options);
        var writer = this.global.createWriter();
        var structurePrinter = this.global.structurePrinterFactory.forSourceFile({
            isAmbient: utils_1.FileUtils.getExtension(filePath) === ".d.ts"
        });
        structurePrinter.printText(writer, structureOrText);
        return this.createSourceFileFromText(filePath, writer.toString(), options);
    };
    /**
     * Creates a source file from a file path and text.
     * Adds it to the cache.
     * @param filePath - File path for the source file.
     * @param sourceText - Text to create the source file with.
     * @param options - Options.
     * @throws InvalidOperationError if the file exists.
     */
    CompilerFactory.prototype.createSourceFileFromText = function (filePath, sourceText, options) {
        filePath = this.global.fileSystemWrapper.getStandardizedAbsolutePath(filePath);
        if (options != null && options.overwrite === true)
            return this.createOrOverwriteSourceFileFromText(filePath, sourceText, options);
        this.throwIfFileExists(filePath);
        return this.getSourceFileFromText(filePath, sourceText, options);
    };
    /**
     * Throws an error if the file exists in the cache or file system.
     * @param filePath - File path.
     * @param prefixMessage - Message to attach on as a prefix.
     */
    CompilerFactory.prototype.throwIfFileExists = function (filePath, prefixMessage) {
        if (!this.containsSourceFileAtPath(filePath) && !this.global.fileSystemWrapper.fileExistsSync(filePath))
            return;
        prefixMessage = prefixMessage == null ? "" : prefixMessage + " ";
        throw new errors.InvalidOperationError(prefixMessage + "A source file already exists at the provided file path: " + filePath);
    };
    CompilerFactory.prototype.createOrOverwriteSourceFileFromText = function (filePath, sourceText, options) {
        filePath = this.global.fileSystemWrapper.getStandardizedAbsolutePath(filePath);
        var existingSourceFile = this.addOrGetSourceFileFromFilePath(filePath, options);
        if (existingSourceFile != null) {
            existingSourceFile.replaceWithText(sourceText);
            return existingSourceFile;
        }
        return this.getSourceFileFromText(filePath, sourceText, options);
    };
    /**
     * Creates a temporary source file that won't be added to the language service.
     * @param sourceText - Text to create the source file with.
     * @param filePath - File path to use.
     * @returns Wrapped source file.
     */
    CompilerFactory.prototype.createTempSourceFileFromText = function (sourceText, opts) {
        if (opts === void 0) { opts = {}; }
        var _a = opts.filePath, filePath = _a === void 0 ? "tsSimpleAstTempFile.ts" : _a, _b = opts.createLanguageService, createLanguageService = _b === void 0 ? false : _b;
        return createTempSourceFile_1.createTempSourceFile(filePath, sourceText, {
            createLanguageService: createLanguageService,
            compilerOptions: this.global.compilerOptions.get(),
            manipulationSettings: this.global.manipulationSettings.get()
        });
    };
    /**
     * Gets the source file from the cache by a file path.
     * @param filePath - File path.
     */
    CompilerFactory.prototype.getSourceFileFromCacheFromFilePath = function (filePath) {
        filePath = this.global.fileSystemWrapper.getStandardizedAbsolutePath(filePath);
        return this.sourceFileCacheByFilePath.get(filePath);
    };
    /**
     * Gets a source file from a file path. Will use the file path cache if the file exists.
     * @param filePath - File path to get the file from.
     */
    CompilerFactory.prototype.addOrGetSourceFileFromFilePath = function (filePath, options) {
        filePath = this.global.fileSystemWrapper.getStandardizedAbsolutePath(filePath);
        var sourceFile = this.sourceFileCacheByFilePath.get(filePath);
        if (sourceFile == null) {
            if (this.global.fileSystemWrapper.fileExistsSync(filePath)) {
                this.global.logger.log("Loading file: " + filePath);
                sourceFile = this.getSourceFileFromText(filePath, this.global.fileSystemWrapper.readFileSync(filePath, this.global.getEncoding()), options);
                sourceFile.setIsSaved(true); // source files loaded from the disk are saved to start with
            }
            if (sourceFile != null) {
                // ensure these are added to the ast
                sourceFile.getReferencedFiles();
                sourceFile.getTypeReferenceDirectives();
            }
        }
        return sourceFile;
    };
    /**
     * Gets if the internal cache contains a source file at a specific file path.
     * @param filePath - File path to check.
     */
    CompilerFactory.prototype.containsSourceFileAtPath = function (filePath) {
        var absoluteFilePath = this.global.fileSystemWrapper.getStandardizedAbsolutePath(filePath);
        return this.sourceFileCacheByFilePath.has(absoluteFilePath);
    };
    /**
     * Gets if the internal cache contains a source file with the specified directory path.
     * @param dirPath - Directory path to check.
     */
    CompilerFactory.prototype.containsDirectoryAtPath = function (dirPath) {
        var normalizedDirPath = this.global.fileSystemWrapper.getStandardizedAbsolutePath(dirPath);
        return this.directoryCache.has(normalizedDirPath);
    };
    /**
     * Gets the source file for a node.
     * @param compilerNode - Compiler node to get the source file of.
     */
    CompilerFactory.prototype.getSourceFileForNode = function (compilerNode) {
        var currentNode = compilerNode;
        while (currentNode.kind !== typescript_1.SyntaxKind.SourceFile) {
            if (currentNode.parent == null)
                throw new errors.NotImplementedError("Could not find node source file.");
            currentNode = currentNode.parent;
        }
        return this.getSourceFile(currentNode);
    };
    /**
     * Gets if the factory contains the compiler node in its internal cache.
     * @param compilerNode - Compiler node.
     */
    CompilerFactory.prototype.hasCompilerNode = function (compilerNode) {
        return this.nodeCache.has(compilerNode);
    };
    /**
     * Gets an existing node from the cache.
     * @param compilerNode - Compiler node.
     */
    CompilerFactory.prototype.getExistingCompilerNode = function (compilerNode) {
        return this.nodeCache.get(compilerNode);
    };
    /**
     * Gets a wrapped compiler type based on the node's kind.
     * @param node - Node to get the wrapped object from.
     */
    CompilerFactory.prototype.getNodeFromCompilerNode = function (compilerNode, sourceFile) {
        var _this = this;
        if (compilerNode.kind === typescript_1.SyntaxKind.SourceFile)
            return this.getSourceFile(compilerNode);
        var createNode = function (ctor) {
            // ensure the parent is created
            if (compilerNode.parent != null && !_this.nodeCache.has(compilerNode.parent))
                _this.getNodeFromCompilerNode(compilerNode.parent, sourceFile);
            return new ctor(_this.global, compilerNode, sourceFile);
        };
        if (kindToWrapperMappings_1.kindToWrapperMappings[compilerNode.kind] != null)
            return this.nodeCache.getOrCreate(compilerNode, function () { return createNode(kindToWrapperMappings_1.kindToWrapperMappings[compilerNode.kind]); });
        else
            return this.nodeCache.getOrCreate(compilerNode, function () { return createNode(compiler_1.Node); });
    };
    CompilerFactory.prototype.getSourceFileFromText = function (filePath, sourceText, options) {
        var compilerSourceFile = utils_1.createCompilerSourceFile(filePath, sourceText, options.languageVersion != null ? options.languageVersion : this.global.compilerOptions.get().target);
        return this.getSourceFile(compilerSourceFile);
    };
    /**
     * Gets a wrapped source file from a compiler source file.
     * @param sourceFile - Compiler source file.
     */
    CompilerFactory.prototype.getSourceFile = function (compilerSourceFile) {
        var _this = this;
        var wasAdded = false;
        var sourceFile = this.nodeCache.getOrCreate(compilerSourceFile, function () {
            var createdSourceFile = new compiler_1.SourceFile(_this.global, compilerSourceFile);
            _this.addSourceFileToCache(createdSourceFile);
            wasAdded = true;
            return createdSourceFile;
        });
        if (wasAdded)
            this.sourceFileAddedEventContainer.fire(sourceFile);
        return sourceFile;
    };
    CompilerFactory.prototype.addSourceFileToCache = function (sourceFile) {
        this.sourceFileCacheByFilePath.set(sourceFile.getFilePath(), sourceFile);
        this.global.fileSystemWrapper.removeFileDelete(sourceFile.getFilePath());
        this.directoryCache.addSourceFile(sourceFile);
    };
    /**
     * Gets a directory from a path.
     * @param dirPath - Directory path.
     */
    CompilerFactory.prototype.getDirectoryFromPath = function (dirPath) {
        dirPath = this.global.fileSystemWrapper.getStandardizedAbsolutePath(dirPath);
        var directory = this.directoryCache.get(dirPath);
        if (directory == null && this.global.fileSystemWrapper.directoryExistsSync(dirPath))
            directory = this.directoryCache.createOrAddIfExists(dirPath);
        return directory;
    };
    /**
     * Creates or adds a directory if it doesn't exist.
     * @param dirPath - Directory path.
     */
    CompilerFactory.prototype.createDirectoryOrAddIfExists = function (dirPath) {
        return this.directoryCache.createOrAddIfExists(dirPath);
    };
    /**
     * Gets a directory.
     * @param dirPath - Directory path.
     */
    CompilerFactory.prototype.getDirectoryFromCache = function (dirPath) {
        return this.directoryCache.get(dirPath);
    };
    /**
     * Gets all the directories iterated by depth.
     */
    CompilerFactory.prototype.getDirectoriesByDepth = function () {
        return this.directoryCache.getAllByDepth();
    };
    /**
     * Gets the directories without a parent.
     */
    CompilerFactory.prototype.getOrphanDirectories = function () {
        return this.directoryCache.getOrphans();
    };
    /**
     * Gets a warpped symbol display part form a compiler symbol display part.
     * @param compilerObject - Compiler symbol display part.
     */
    CompilerFactory.prototype.getSymbolDisplayPart = function (compilerObject) {
        return this.symbolDisplayPartCache.getOrCreate(compilerObject, function () { return new compiler_1.SymbolDisplayPart(compilerObject); });
    };
    /**
     * Gets a wrapped type from a compiler type.
     * @param type - Compiler type.
     */
    CompilerFactory.prototype.getType = function (type) {
        var _this = this;
        if ((type.flags & typescript_1.TypeFlags.TypeParameter) === typescript_1.TypeFlags.TypeParameter)
            return this.getTypeParameter(type);
        return this.typeCache.getOrCreate(type, function () { return new compiler_1.Type(_this.global, type); });
    };
    /**
     * Gets a wrapped type parameter from a compiler type parameter.
     * @param typeParameter - Compiler type parameter
     */
    CompilerFactory.prototype.getTypeParameter = function (typeParameter) {
        var _this = this;
        return this.typeParameterCache.getOrCreate(typeParameter, function () { return new compiler_1.TypeParameter(_this.global, typeParameter); });
    };
    /**
     * Gets a wrapped signature from a compiler signature.
     * @param signature - Compiler signature.
     */
    CompilerFactory.prototype.getSignature = function (signature) {
        var _this = this;
        return this.signatureCache.getOrCreate(signature, function () { return new compiler_1.Signature(_this.global, signature); });
    };
    /**
     * Gets a wrapped symbol from a compiler symbol.
     * @param symbol - Compiler symbol.
     */
    CompilerFactory.prototype.getSymbol = function (symbol) {
        var _this = this;
        return this.symbolCache.getOrCreate(symbol, function () { return new compiler_1.Symbol(_this.global, symbol); });
    };
    /**
     * Gets a wrapped definition info from a compiler object.
     * @param compilerObject - Compiler definition info.
     */
    CompilerFactory.prototype.getDefinitionInfo = function (compilerObject) {
        var _this = this;
        return this.definitionInfoCache.getOrCreate(compilerObject, function () { return new compiler_1.DefinitionInfo(_this.global, compilerObject); });
    };
    /**
     * Gets a wrapped document span from a compiler object.
     * @param compilerObject - Compiler document span.
     */
    CompilerFactory.prototype.getDocumentSpan = function (compilerObject) {
        var _this = this;
        return this.documentSpanCache.getOrCreate(compilerObject, function () { return new compiler_1.DocumentSpan(_this.global, compilerObject); });
    };
    /**
     * Gets a wrapped referenced entry from a compiler object.
     * @param compilerObject - Compiler referenced entry.
     */
    CompilerFactory.prototype.getReferenceEntry = function (compilerObject) {
        var _this = this;
        return this.referenceEntryCache.getOrCreate(compilerObject, function () { return new compiler_1.ReferenceEntry(_this.global, compilerObject); });
    };
    /**
     * Gets a wrapped referenced symbol from a compiler object.
     * @param compilerObject - Compiler referenced symbol.
     */
    CompilerFactory.prototype.getReferencedSymbol = function (compilerObject) {
        var _this = this;
        return this.referencedSymbolCache.getOrCreate(compilerObject, function () { return new compiler_1.ReferencedSymbol(_this.global, compilerObject); });
    };
    /**
     * Gets a wrapped referenced symbol definition info from a compiler object.
     * @param compilerObject - Compiler referenced symbol definition info.
     */
    CompilerFactory.prototype.getReferencedSymbolDefinitionInfo = function (compilerObject) {
        var _this = this;
        return this.referencedSymbolDefinitionInfoCache.getOrCreate(compilerObject, function () { return new compiler_1.ReferencedSymbolDefinitionInfo(_this.global, compilerObject); });
    };
    /**
     * Gets a wrapped diagnostic from a compiler diagnostic.
     * @param diagnostic - Compiler diagnostic.
     */
    CompilerFactory.prototype.getDiagnostic = function (diagnostic) {
        var _this = this;
        return this.diagnosticCache.getOrCreate(diagnostic, function () {
            if (diagnostic.start != null)
                return new compiler_1.DiagnosticWithLocation(_this.global, diagnostic);
            return new compiler_1.Diagnostic(_this.global, diagnostic);
        });
    };
    /**
     * Gets a wrapped diagnostic with location from a compiler diagnostic.
     * @param diagnostic - Compiler diagnostic.
     */
    CompilerFactory.prototype.getDiagnosticWithLocation = function (diagnostic) {
        var _this = this;
        return this.diagnosticCache.getOrCreate(diagnostic, function () { return new compiler_1.DiagnosticWithLocation(_this.global, diagnostic); });
    };
    /**
     * Gets a wrapped diagnostic message chain from a compiler diagnostic message chain.
     * @param diagnosticMessageChain - Compiler diagnostic message chain.
     */
    CompilerFactory.prototype.getDiagnosticMessageChain = function (compilerObject) {
        return this.diagnosticMessageChainCache.getOrCreate(compilerObject, function () { return new compiler_1.DiagnosticMessageChain(compilerObject); });
    };
    /**
     * Gets a warpped JS doc tag info from a compiler object.
     * @param jsDocTagInfo - Compiler object.
     */
    CompilerFactory.prototype.getJSDocTagInfo = function (jsDocTagInfo) {
        return this.jsDocTagInfoCache.getOrCreate(jsDocTagInfo, function () { return new compiler_1.JSDocTagInfo(jsDocTagInfo); });
    };
    /**
     * Replaces a compiler node in the cache.
     * @param oldNode - Old node to remove.
     * @param newNode - New node to use.
     */
    CompilerFactory.prototype.replaceCompilerNode = function (oldNode, newNode) {
        var nodeToReplace = oldNode instanceof compiler_1.Node ? oldNode.compilerNode : oldNode;
        var node = oldNode instanceof compiler_1.Node ? oldNode : this.nodeCache.get(oldNode);
        if (nodeToReplace.kind === typescript_1.SyntaxKind.SourceFile && nodeToReplace.fileName !== newNode.fileName) {
            var oldFilePath = nodeToReplace.fileName;
            var sourceFile = node;
            this.removeCompilerNodeFromCache(nodeToReplace);
            sourceFile.replaceCompilerNodeFromFactory(newNode);
            this.nodeCache.set(newNode, sourceFile);
            this.addSourceFileToCache(sourceFile);
            this.sourceFileAddedEventContainer.fire(sourceFile);
        }
        else {
            this.nodeCache.replaceKey(nodeToReplace, newNode);
            if (node != null)
                node.replaceCompilerNodeFromFactory(newNode);
        }
    };
    /**
     * Removes a node from the cache.
     * @param node - Node to remove.
     */
    CompilerFactory.prototype.removeNodeFromCache = function (node) {
        this.removeCompilerNodeFromCache(node.compilerNode);
    };
    /**
     * Removes a compiler node from the cache.
     * @param compilerNode - Compiler node to remove.
     */
    CompilerFactory.prototype.removeCompilerNodeFromCache = function (compilerNode) {
        this.nodeCache.removeByKey(compilerNode);
        if (compilerNode.kind === typescript_1.SyntaxKind.SourceFile) {
            var sourceFile = compilerNode;
            this.directoryCache.removeSourceFile(sourceFile.fileName);
            var tsSourceFile = this.sourceFileCacheByFilePath.get(sourceFile.fileName);
            this.sourceFileCacheByFilePath.removeByKey(sourceFile.fileName);
            if (tsSourceFile != null)
                this.sourceFileRemovedEventContainer.fire(tsSourceFile);
        }
    };
    /**
     * Adds the specified directory to the cache.
     * @param directory - Directory
     */
    CompilerFactory.prototype.addDirectoryToCache = function (directory) {
        this.directoryCache.addDirectory(directory);
    };
    /**
     * Removes the directory from the cache.
     * @param dirPath - Directory path.
     */
    CompilerFactory.prototype.removeDirectoryFromCache = function (dirPath) {
        this.directoryCache.remove(dirPath);
    };
    /**
     * Forgets the nodes created in the block.
     * @param block - Block of code to run.
     */
    CompilerFactory.prototype.forgetNodesCreatedInBlock = function (block) {
        var _this = this;
        // can't use the async keyword here because exceptions that happen when doing this synchronously need to be thrown
        this.nodeCache.setForgetPoint();
        var wasPromise = false;
        try {
            var result = block(function () {
                var e_2, _a;
                var nodes = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    nodes[_i] = arguments[_i];
                }
                try {
                    for (var nodes_1 = tslib_1.__values(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
                        var node = nodes_1_1.value;
                        _this.nodeCache.rememberNode(node);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            });
            if (result != null && typeof result.then === "function") {
                wasPromise = true;
                return result.then(function () { return _this.nodeCache.forgetLastPoint(); });
            }
        }
        finally {
            if (!wasPromise)
                this.nodeCache.forgetLastPoint();
        }
        return Promise.resolve();
    };
    return CompilerFactory;
}());
exports.CompilerFactory = CompilerFactory;
