"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DiagnosticMessageChain_1 = require("./DiagnosticMessageChain");
/**
 * Diagnostic.
 */
var Diagnostic = /** @class */ (function () {
    /** @internal */
    function Diagnostic(global, compilerObject) {
        this.global = global;
        this._compilerObject = compilerObject;
    }
    Object.defineProperty(Diagnostic.prototype, "compilerObject", {
        /**
         * Gets the underlying compiler diagnostic.
         */
        get: function () {
            return this._compilerObject;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the source file.
     */
    Diagnostic.prototype.getSourceFile = function () {
        if (this.global == null)
            return undefined;
        var file = this.compilerObject.file;
        return file == null ? undefined : this.global.compilerFactory.getSourceFile(file);
    };
    /**
     * Gets the message text.
     */
    Diagnostic.prototype.getMessageText = function () {
        var messageText = this._compilerObject.messageText;
        if (typeof messageText === "string")
            return messageText;
        if (this.global == null)
            return new DiagnosticMessageChain_1.DiagnosticMessageChain(messageText);
        else
            return this.global.compilerFactory.getDiagnosticMessageChain(messageText);
    };
    /**
     * Gets the line number.
     */
    Diagnostic.prototype.getLineNumber = function () {
        var sourceFile = this.getSourceFile();
        var start = this.getStart();
        if (sourceFile == null || start == null)
            return undefined;
        return sourceFile.getLineNumberAtPos(start);
    };
    /**
     * Gets the start.
     */
    Diagnostic.prototype.getStart = function () {
        return this.compilerObject.start;
    };
    /**
     * Gets the length.
     */
    Diagnostic.prototype.getLength = function () {
        return this.compilerObject.length;
    };
    /**
     * Gets the diagnostic category.
     */
    Diagnostic.prototype.getCategory = function () {
        return this.compilerObject.category;
    };
    /**
     * Gets the code of the diagnostic.
     */
    Diagnostic.prototype.getCode = function () {
        return this.compilerObject.code;
    };
    /**
     * Gets the source.
     */
    Diagnostic.prototype.getSource = function () {
        return this.compilerObject.source;
    };
    return Diagnostic;
}());
exports.Diagnostic = Diagnostic;
