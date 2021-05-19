"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Signature = /** @class */ (function () {
    /**
     * Initializes a new instance of Signature.
     * @internal
     * @param global - GlobalContainer.
     * @param signature - Compiler signature.
     */
    function Signature(global, signature) {
        this.global = global;
        this._compilerSignature = signature;
    }
    Object.defineProperty(Signature.prototype, "compilerSignature", {
        /**
         * Gets the underlying compiler signature.
         */
        get: function () {
            return this._compilerSignature;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the type parameters.
     */
    Signature.prototype.getTypeParameters = function () {
        var _this = this;
        var typeParameters = this.compilerSignature.typeParameters || [];
        return typeParameters.map(function (t) { return _this.global.compilerFactory.getTypeParameter(t); });
    };
    /**
     * Gets the parameters.
     */
    Signature.prototype.getParameters = function () {
        var _this = this;
        return this.compilerSignature.parameters.map(function (p) { return _this.global.compilerFactory.getSymbol(p); });
    };
    /**
     * Gets the signature return type.
     */
    Signature.prototype.getReturnType = function () {
        return this.global.compilerFactory.getType(this.compilerSignature.getReturnType());
    };
    /**
     * Get the documentation comments.
     */
    Signature.prototype.getDocumentationComments = function () {
        var _this = this;
        var docs = this.compilerSignature.getDocumentationComment(this.global.typeChecker.compilerObject);
        return docs.map(function (d) { return _this.global.compilerFactory.getSymbolDisplayPart(d); });
    };
    /**
     * Gets the JS doc tags.
     */
    Signature.prototype.getJsDocTags = function () {
        var _this = this;
        var tags = this.compilerSignature.getJsDocTags();
        return tags.map(function (t) { return _this.global.compilerFactory.getJSDocTagInfo(t); });
    };
    return Signature;
}());
exports.Signature = Signature;
