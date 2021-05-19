"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs = require("fs-extra");
var globby = require("globby");
var nodePath = require("path");
var errors = require("../errors");
var utils_1 = require("../utils");
var DefaultFileSystemHost = /** @class */ (function () {
    function DefaultFileSystemHost() {
    }
    DefaultFileSystemHost.prototype.delete = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs.unlink(path, function (err) {
                if (err)
                    reject(_this.getFileNotFoundErrorIfNecessary(err, path));
                else
                    resolve();
            });
        });
    };
    DefaultFileSystemHost.prototype.deleteSync = function (path) {
        try {
            fs.unlinkSync(path);
        }
        catch (err) {
            throw this.getFileNotFoundErrorIfNecessary(err, path);
        }
    };
    DefaultFileSystemHost.prototype.readDirSync = function (dirPath) {
        try {
            return fs.readdirSync(dirPath).map(function (name) { return utils_1.FileUtils.pathJoin(dirPath, name); });
        }
        catch (err) {
            throw this.getDirectoryNotFoundErrorIfNecessary(err, dirPath);
        }
    };
    DefaultFileSystemHost.prototype.readFile = function (filePath, encoding) {
        var _this = this;
        if (encoding === void 0) { encoding = "utf-8"; }
        return new Promise(function (resolve, reject) {
            fs.readFile(filePath, encoding, function (err, data) {
                if (err)
                    reject(_this.getFileNotFoundErrorIfNecessary(err, filePath));
                else
                    resolve(data);
            });
        });
    };
    DefaultFileSystemHost.prototype.readFileSync = function (filePath, encoding) {
        if (encoding === void 0) { encoding = "utf-8"; }
        try {
            return fs.readFileSync(filePath, encoding);
        }
        catch (err) {
            throw this.getFileNotFoundErrorIfNecessary(err, filePath);
        }
    };
    DefaultFileSystemHost.prototype.writeFile = function (filePath, fileText) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            fs.writeFile(filePath, fileText, function (err) {
                                if (err)
                                    reject(err);
                                else
                                    resolve();
                            });
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DefaultFileSystemHost.prototype.writeFileSync = function (filePath, fileText) {
        fs.writeFileSync(filePath, fileText);
    };
    DefaultFileSystemHost.prototype.mkdir = function (dirPath) {
        return new Promise(function (resolve, reject) {
            fs.mkdir(dirPath, function (err) {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    };
    DefaultFileSystemHost.prototype.mkdirSync = function (dirPath) {
        fs.mkdirSync(dirPath);
    };
    DefaultFileSystemHost.prototype.move = function (srcPath, destPath) {
        return fs.move(srcPath, destPath, { overwrite: true });
    };
    DefaultFileSystemHost.prototype.moveSync = function (srcPath, destPath) {
        fs.moveSync(srcPath, destPath, { overwrite: true });
    };
    DefaultFileSystemHost.prototype.copy = function (srcPath, destPath) {
        return fs.copy(srcPath, destPath, { overwrite: true });
    };
    DefaultFileSystemHost.prototype.copySync = function (srcPath, destPath) {
        fs.copySync(srcPath, destPath, { overwrite: true });
    };
    DefaultFileSystemHost.prototype.fileExists = function (filePath) {
        return new Promise(function (resolve, reject) {
            fs.stat(filePath, function (err, stat) {
                if (err)
                    resolve(false);
                else
                    resolve(stat.isFile());
            });
        });
    };
    DefaultFileSystemHost.prototype.fileExistsSync = function (filePath) {
        try {
            return fs.statSync(filePath).isFile();
        }
        catch (err) {
            return false;
        }
    };
    DefaultFileSystemHost.prototype.directoryExists = function (dirPath) {
        return new Promise(function (resolve, reject) {
            fs.stat(dirPath, function (err, stat) {
                if (err)
                    resolve(false);
                else
                    resolve(stat.isDirectory());
            });
        });
    };
    DefaultFileSystemHost.prototype.directoryExistsSync = function (dirPath) {
        try {
            return fs.statSync(dirPath).isDirectory();
        }
        catch (err) {
            return false;
        }
    };
    DefaultFileSystemHost.prototype.getCurrentDirectory = function () {
        return utils_1.FileUtils.standardizeSlashes(nodePath.resolve());
    };
    DefaultFileSystemHost.prototype.glob = function (patterns) {
        return globby.sync(patterns, {
            cwd: this.getCurrentDirectory(),
            absolute: true
        });
    };
    DefaultFileSystemHost.prototype.getDirectoryNotFoundErrorIfNecessary = function (err, path) {
        return utils_1.FileUtils.isNotExistsError(err) ? new errors.DirectoryNotFoundError(path) : err;
    };
    DefaultFileSystemHost.prototype.getFileNotFoundErrorIfNecessary = function (err, path) {
        return utils_1.FileUtils.isNotExistsError(err) ? new errors.FileNotFoundError(path) : err;
    };
    return DefaultFileSystemHost;
}());
exports.DefaultFileSystemHost = DefaultFileSystemHost;
