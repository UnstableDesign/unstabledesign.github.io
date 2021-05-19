"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ArgumentError_1 = require("./ArgumentError");
var ArgumentNullOrWhitespaceError = /** @class */ (function (_super) {
    tslib_1.__extends(ArgumentNullOrWhitespaceError, _super);
    function ArgumentNullOrWhitespaceError(argName) {
        var _this = _super.call(this, argName, "Cannot be null or whitespace.", ArgumentNullOrWhitespaceError.prototype) || this;
        _this.argName = argName;
        return _this;
    }
    return ArgumentNullOrWhitespaceError;
}(ArgumentError_1.ArgumentError));
exports.ArgumentNullOrWhitespaceError = ArgumentNullOrWhitespaceError;
