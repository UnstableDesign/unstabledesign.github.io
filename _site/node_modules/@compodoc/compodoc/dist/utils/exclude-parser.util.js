"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var glob = require('glob');
var ExcludeParserUtil = /** @class */ (function () {
    function ExcludeParserUtil() {
        this._globFiles = [];
    }
    ExcludeParserUtil.prototype.init = function (exclude, cwd) {
        this._exclude = exclude;
        this._cwd = cwd;
        var i = 0;
        var len = exclude.length;
        for (i; i < len; i++) {
            this._globFiles = this._globFiles.concat(glob.sync(exclude[i], { cwd: this._cwd }));
        }
    };
    ExcludeParserUtil.prototype.testFile = function (file) {
        var i = 0;
        var len = this._exclude.length;
        var fileBasename = path.basename(file);
        var result = false;
        for (i; i < len; i++) {
            if (glob.hasMagic(this._exclude[i]) && this._globFiles.length > 0) {
                var resultGlobSearch = this._globFiles.findIndex(function (element) {
                    return path.basename(element) === fileBasename;
                });
                result = resultGlobSearch !== -1;
            }
            else {
                result = fileBasename === path.basename(this._exclude[i]);
            }
            if (result) {
                break;
            }
        }
        return result;
    };
    return ExcludeParserUtil;
}());
exports.ExcludeParserUtil = ExcludeParserUtil;
//# sourceMappingURL=exclude-parser.util.js.map