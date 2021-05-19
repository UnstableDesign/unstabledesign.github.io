"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var glob = require('glob');
var IncludeParserUtil = /** @class */ (function () {
    function IncludeParserUtil() {
        this._globFiles = [];
    }
    IncludeParserUtil.prototype.init = function (include, cwd) {
        this._include = include;
        this._cwd = cwd;
        var i = 0;
        var len = include.length;
        for (i; i < len; i++) {
            this._globFiles = this._globFiles.concat(glob.sync(include[i], { cwd: this._cwd }));
        }
    };
    IncludeParserUtil.prototype.testFile = function (file) {
        var i = 0;
        var len = this._include.length;
        var fileBasename = path.basename(file);
        var fileNameInCwd = file.replace(this._cwd + path.sep, '');
        var result = false;
        if (path.sep === '\\') {
            fileNameInCwd = fileNameInCwd.replace(new RegExp('\\' + path.sep, 'g'), '/');
        }
        for (i; i < len; i++) {
            if (glob.hasMagic(this._include[i]) && this._globFiles.length > 0) {
                var resultGlobSearch = this._globFiles.findIndex(function (element) {
                    return element === fileNameInCwd;
                });
                result = resultGlobSearch !== -1;
            }
            else {
                result = fileNameInCwd === this._include[i];
            }
            if (result) {
                break;
            }
        }
        return result;
    };
    return IncludeParserUtil;
}());
exports.IncludeParserUtil = IncludeParserUtil;
//# sourceMappingURL=include-parser.util.js.map