"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BaseError_1 = require("./BaseError");
var DirectoryNotFoundError = /** @class */ (function (_super) {
    tslib_1.__extends(DirectoryNotFoundError, _super);
    function DirectoryNotFoundError(dirPath) {
        var _this = _super.call(this, "Directory not found: " + dirPath, DirectoryNotFoundError.prototype) || this;
        _this.dirPath = dirPath;
        _this.code = "ENOENT";
        return _this;
    }
    return DirectoryNotFoundError;
}(BaseError_1.BaseError));
exports.DirectoryNotFoundError = DirectoryNotFoundError;
