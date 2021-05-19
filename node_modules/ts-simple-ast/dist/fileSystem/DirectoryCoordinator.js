"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors = require("../errors");
var utils_1 = require("../utils");
/**
 * Contains common methods between Project and Directory.
 *
 * I'll definitely need to refactor this in the future... just putting these methods in a common place for now.
 */
var DirectoryCoordinator = /** @class */ (function () {
    function DirectoryCoordinator(compilerFactory, fileSystemWrapper) {
        this.compilerFactory = compilerFactory;
        this.fileSystemWrapper = fileSystemWrapper;
    }
    DirectoryCoordinator.prototype.addExistingDirectoryIfExists = function (dirPath, options) {
        var e_1, _a;
        var directory = this.compilerFactory.getDirectoryFromPath(dirPath);
        if (directory == null)
            return undefined;
        if (options.recursive) {
            try {
                for (var _b = tslib_1.__values(utils_1.FileUtils.getDescendantDirectories(this.fileSystemWrapper, dirPath)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var descendantDirPath = _c.value;
                    this.compilerFactory.createDirectoryOrAddIfExists(descendantDirPath);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return directory;
    };
    DirectoryCoordinator.prototype.addExistingDirectory = function (dirPath, options) {
        var directory = this.addExistingDirectoryIfExists(dirPath, options);
        if (directory == null)
            throw new errors.DirectoryNotFoundError(dirPath);
        return directory;
    };
    DirectoryCoordinator.prototype.createDirectoryOrAddIfExists = function (dirPath) {
        return this.compilerFactory.createDirectoryOrAddIfExists(dirPath);
    };
    return DirectoryCoordinator;
}());
exports.DirectoryCoordinator = DirectoryCoordinator;
