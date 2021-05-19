"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
var FileEngine = /** @class */ (function () {
    function FileEngine() {
    }
    FileEngine.prototype.get = function (filepath) {
        return new Promise(function (resolve, reject) {
            fs.readFile(path.resolve(filepath), 'utf8', function (err, data) {
                if (err) {
                    reject('Error during ' + filepath + ' read');
                }
                else {
                    resolve(data);
                }
            });
        });
    };
    FileEngine.prototype.write = function (filepath, contents) {
        return new Promise(function (resolve, reject) {
            fs.outputFile(path.resolve(filepath), contents, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    };
    /**
     * @param file The file to check
     */
    FileEngine.prototype.existsSync = function (file) {
        return fs.existsSync(file);
    };
    return FileEngine;
}());
exports.FileEngine = FileEngine;
//# sourceMappingURL=file.engine.js.map