"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BaseError_1 = require("./BaseError");
var FileNotFoundError = /** @class */ (function (_super) {
    tslib_1.__extends(FileNotFoundError, _super);
    function FileNotFoundError(filePath) {
        var _this = _super.call(this, "File not found: " + filePath, FileNotFoundError.prototype) || this;
        _this.filePath = filePath;
        _this.code = "ENOENT";
        return _this;
    }
    return FileNotFoundError;
}(BaseError_1.BaseError));
exports.FileNotFoundError = FileNotFoundError;
