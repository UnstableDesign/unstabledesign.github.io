"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BaseError_1 = require("./BaseError");
var NotImplementedError = /** @class */ (function (_super) {
    tslib_1.__extends(NotImplementedError, _super);
    function NotImplementedError(message) {
        var _this = _super.call(this, message, NotImplementedError.prototype) || this;
        _this.message = message;
        return _this;
    }
    return NotImplementedError;
}(BaseError_1.BaseError));
exports.NotImplementedError = NotImplementedError;
