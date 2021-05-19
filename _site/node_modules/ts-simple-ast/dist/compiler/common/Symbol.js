"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors = require("../../errors");
var typescript_1 = require("../../typescript");
var utils_1 = require("../../utils");
var Symbol = /** @class */ (function () {
    /**
     * Initializes a new instance of Symbol.
     * @internal
     * @param global - Global container.
     * @param symbol - Compiler symbol.
     */
    function Symbol(global, symbol) {
        this.global = global;
        this._compilerSymbol = symbol;
        // wrap these immediately
        this.getValueDeclaration();
        this.getDeclarations();
    }
    Object.defineProperty(Symbol.prototype, "compilerSymbol", {
        /**
         * Gets the underlying compiler symbol.
         */
        get: function () {
            return this._compilerSymbol;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the symbol name.
     */
    Symbol.prototype.getName = function () {
        return this.compilerSymbol.getName();
    };
    /**
     * Gets the escaped name.
     */
    Symbol.prototype.getEscapedName = function () {
        return this.compilerSymbol.escapedName;
    };
    /**
     * Gets the aliased symbol.
     */
    Symbol.prototype.getAliasedSymbol = function () {
        return this.global.typeChecker.getAliasedSymbol(this);
    };
    /**
     * Gets if the symbol is an alias.
     */
    Symbol.prototype.isAlias = function () {
        return (this.getFlags() & typescript_1.SymbolFlags.Alias) === typescript_1.SymbolFlags.Alias;
    };
    /**
     * Gets the symbol flags.
     */
    Symbol.prototype.getFlags = function () {
        return this.compilerSymbol.getFlags();
    };
    /**
     * Gets if the symbol has the specified flags.
     * @param flags - Flags to check if the symbol has.
     */
    Symbol.prototype.hasFlags = function (flags) {
        return (this.compilerSymbol.flags & flags) === flags;
    };
    /**
     * Gets the value declaration of a symbol or throws if it doesn't exist.
     */
    Symbol.prototype.getValueDeclarationOrThrow = function () {
        var _this = this;
        return errors.throwIfNullOrUndefined(this.getValueDeclaration(), function () { return "Expected to find the value declaration of symbol '" + _this.getName() + "'."; });
    };
    /**
     * Gets the value declaration of the symbol or returns undefined if it doesn't exist.
     */
    Symbol.prototype.getValueDeclaration = function () {
        var declaration = this.compilerSymbol.valueDeclaration;
        if (declaration == null)
            return undefined;
        return this.global.compilerFactory.getNodeFromCompilerNode(declaration, this.global.compilerFactory.getSourceFileForNode(declaration));
    };
    /**
     * Gets the symbol declarations.
     */
    Symbol.prototype.getDeclarations = function () {
        var _this = this;
        // todo: is it important that this might return undefined in ts 2.4?
        return (this.compilerSymbol.declarations || []).map(function (d) { return _this.global.compilerFactory.getNodeFromCompilerNode(d, _this.global.compilerFactory.getSourceFileForNode(d)); });
    };
    /**
     * Get the exports of the symbol.
     * @param name - Name of the export.
     */
    Symbol.prototype.getExportByName = function (name) {
        if (this.compilerSymbol.exports == null)
            return undefined;
        var tsSymbol = this.compilerSymbol.exports.get(name);
        return tsSymbol == null ? undefined : this.global.compilerFactory.getSymbol(tsSymbol);
    };
    /**
     * Gets the exports from the symbol.
     */
    Symbol.prototype.getExports = function () {
        var _this = this;
        if (this.compilerSymbol.exports == null)
            return [];
        return utils_1.ArrayUtils.from(this.compilerSymbol.exports.values()).map(function (symbol) { return _this.global.compilerFactory.getSymbol(symbol); });
    };
    /**
     * Gets the declared type of the symbol.
     */
    Symbol.prototype.getDeclaredType = function () {
        return this.global.typeChecker.getDeclaredTypeOfSymbol(this);
    };
    /**
     * Gets the type of the symbol at a location.
     * @param node - Location to get the type at for this symbol.
     */
    Symbol.prototype.getTypeAtLocation = function (node) {
        return this.global.typeChecker.getTypeOfSymbolAtLocation(this, node);
    };
    /**
     * Gets the fully qualified name.
     */
    Symbol.prototype.getFullyQualifiedName = function () {
        return this.global.typeChecker.getFullyQualifiedName(this);
    };
    return Symbol;
}());
exports.Symbol = Symbol;
