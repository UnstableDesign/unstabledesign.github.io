"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var utils_1 = require("../../../utils");
/**
 * Result of an emit.
 */
var EmitResult = /** @class */ (function () {
    /**
     * @internal
     */
    function EmitResult(global, compilerObject) {
        this.global = global;
        this._compilerObject = compilerObject;
    }
    Object.defineProperty(EmitResult.prototype, "compilerObject", {
        /**
         * TypeScript compiler emit result.
         */
        get: function () {
            return this._compilerObject;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * If the emit was skipped.
     */
    EmitResult.prototype.getEmitSkipped = function () {
        return this.compilerObject.emitSkipped;
    };
    /**
     * Contains declaration emit diagnostics.
     */
    EmitResult.prototype.getDiagnostics = function () {
        var _this = this;
        return this.compilerObject.diagnostics.map(function (d) { return _this.global.compilerFactory.getDiagnostic(d); });
    };
    tslib_1.__decorate([
        utils_1.Memoize
    ], EmitResult.prototype, "getDiagnostics", null);
    return EmitResult;
}());
exports.EmitResult = EmitResult;
