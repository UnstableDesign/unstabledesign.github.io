"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileSystemWrapper_1 = require("../fileSystem/FileSystemWrapper");
var VirtualFileSystemHost_1 = require("../fileSystem/VirtualFileSystemHost");
var GlobalContainer_1 = require("../GlobalContainer");
var typescript_1 = require("../typescript");
function createTempSourceFile(filePath, sourceText, opts) {
    if (opts === void 0) { opts = {}; }
    var _a = opts.createLanguageService, createLanguageService = _a === void 0 ? false : _a, _b = opts.compilerOptions, compilerOptions = _b === void 0 ? { target: typescript_1.ScriptTarget.Latest } : _b;
    var globalContainer = new GlobalContainer_1.GlobalContainer(new FileSystemWrapper_1.FileSystemWrapper(new VirtualFileSystemHost_1.VirtualFileSystemHost()), compilerOptions, { createLanguageService: createLanguageService });
    if (opts.manipulationSettings != null)
        globalContainer.manipulationSettings.set(opts.manipulationSettings);
    return globalContainer.compilerFactory.createSourceFileFromText(filePath, sourceText, {});
}
exports.createTempSourceFile = createTempSourceFile;
