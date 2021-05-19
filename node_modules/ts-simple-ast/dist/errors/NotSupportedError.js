"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BaseError_1 = require("./BaseError");
var NotSupportedError = /** @class */ (function (_super) {
    tslib_1.__extends(NotSupportedError, _super);
    function NotSupportedError(message) {
        var _this = _super.call(this, message, NotSupportedError.prototype) || this;
        _this.message = message;
        return _this;
    }
    return NotSupportedError;
}(BaseError_1.BaseError));
exports.NotSupportedError = NotSupportedError;
