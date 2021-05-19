"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BaseError_1 = require("./BaseError");
var PathNotFoundError = /** @class */ (function (_super) {
    tslib_1.__extends(PathNotFoundError, _super);
    function PathNotFoundError(path) {
        var _this = _super.call(this, "Path not found: " + path, PathNotFoundError.prototype) || this;
        _this.path = path;
        _this.code = "ENOENT";
        return _this;
    }
    return PathNotFoundError;
}(BaseError_1.BaseError));
exports.PathNotFoundError = PathNotFoundError;
