"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = require("../../typescript");
var tsInternal = require("../../typescript/tsInternal");
var results_1 = require("./results");
var TypeChecker_1 = require("./TypeChecker");
/**
 * Wrapper around Program.
 */
var Program = /** @class */ (function () {
    /** @internal */
    function Program(global, rootNames, host) {
        this.global = global;
        this.typeChecker = new TypeChecker_1.TypeChecker(this.global);
        this.reset(rootNames, host);
    }
    Object.defineProperty(Program.prototype, "compilerObject", {
        /**
         * Gets the underlying compiler program.
         */
        get: function () {
            return this._getOrCreateCompilerObject();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Resets the program.
     * @internal
     */
    Program.prototype.reset = function (rootNames, host) {
        var _this = this;
        var compilerOptions = this.global.compilerOptions.get();
        this._getOrCreateCompilerObject = function () {
            if (_this._createdCompilerObject == null)
                _this._createdCompilerObject = typescript_1.ts.createProgram(rootNames, compilerOptions, host);
            // this needs to be on a separate line in case the program was reset between the line above and here
            return _this._createdCompilerObject || _this._getOrCreateCompilerObject();
        };
        this._createdCompilerObject = undefined;
        this.typeChecker.reset(function () { return _this.compilerObject.getTypeChecker(); });
    };
    /**
     * Get the program's type checker.
     */
    Program.prototype.getTypeChecker = function () {
        return this.typeChecker;
    };
    /**
     * Emits the TypeScript files to the specified target.
     */
    Program.prototype.emit = function (options) {
        if (options === void 0) { options = {}; }
        var targetSourceFile = options != null && options.targetSourceFile != null ? options.targetSourceFile.compilerNode : undefined;
        var cancellationToken = undefined; // todo: expose this
        var emitOnlyDtsFiles = options != null && options.emitOnlyDtsFiles != null ? options.emitOnlyDtsFiles : undefined;
        var customTransformers = undefined; // todo: expose this
        var emitResult = this.compilerObject.emit(targetSourceFile, undefined, cancellationToken, emitOnlyDtsFiles, customTransformers);
        return new results_1.EmitResult(this.global, emitResult);
    };
    /**
     * Gets the syntactic diagnostics.
     * @param sourceFile - Optional source file.
     */
    Program.prototype.getSyntacticDiagnostics = function (sourceFile) {
        var _this = this;
        var compilerDiagnostics = this.compilerObject.getSyntacticDiagnostics(sourceFile == null ? undefined : sourceFile.compilerNode);
        return compilerDiagnostics.map(function (d) { return _this.global.compilerFactory.getDiagnosticWithLocation(d); });
    };
    /**
     * Gets the semantic diagnostics.
     * @param sourceFile - Optional source file.
     */
    Program.prototype.getSemanticDiagnostics = function (sourceFile) {
        var _this = this;
        var compilerDiagnostics = this.compilerObject.getSemanticDiagnostics(sourceFile == null ? undefined : sourceFile.compilerNode);
        return compilerDiagnostics.map(function (d) { return _this.global.compilerFactory.getDiagnostic(d); });
    };
    /**
     * Gets the declaration diagnostics.
     * @param sourceFile - Optional source file.
     */
    Program.prototype.getDeclarationDiagnostics = function (sourceFile) {
        var _this = this;
        var compilerDiagnostics = this.compilerObject.getDeclarationDiagnostics(sourceFile == null ? undefined : sourceFile.compilerNode);
        return compilerDiagnostics.map(function (d) { return _this.global.compilerFactory.getDiagnosticWithLocation(d); });
    };
    /**
     * Gets the pre-emit diagnostics.
     * @param sourceFile - Source file.
     */
    Program.prototype.getPreEmitDiagnostics = function (sourceFile) {
        var _this = this;
        var compilerDiagnostics = typescript_1.ts.getPreEmitDiagnostics(this.compilerObject, sourceFile == null ? undefined : sourceFile.compilerNode);
        return compilerDiagnostics.map(function (d) { return _this.global.compilerFactory.getDiagnostic(d); });
    };
    /**
     * Gets the emit module resolution kind.
     */
    Program.prototype.getEmitModuleResolutionKind = function () {
        return tsInternal.getEmitModuleResolutionKind(this.compilerObject.getCompilerOptions());
    };
    /**
     * Gets if the provided source file is from an external library.
     * @param sourceFile - Source file.
     */
    Program.prototype.isSourceFileFromExternalLibrary = function (sourceFile) {
        return this.compilerObject.isSourceFileFromExternalLibrary(sourceFile.compilerNode);
    };
    return Program;
}());
exports.Program = Program;
