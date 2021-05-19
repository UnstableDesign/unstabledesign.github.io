"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsDocHelper = /** @class */ (function () {
    function JsDocHelper() {
    }
    JsDocHelper.prototype.hasJSDocInternalTag = function (filename, sourceFile, node) {
        if (typeof sourceFile.statements !== 'undefined') {
            return this.checkStatements(sourceFile.statements, node);
        }
        return false;
    };
    JsDocHelper.prototype.checkStatements = function (statements, node) {
        var _this = this;
        return statements.some(function (x) { return _this.checkStatement(x, node); });
    };
    JsDocHelper.prototype.checkStatement = function (statement, node) {
        if (statement.pos === node.pos && statement.end === node.end) {
            if (node.jsDoc && node.jsDoc.length > 0) {
                return this.checkJsDocs(node.jsDoc);
            }
        }
        return false;
    };
    JsDocHelper.prototype.checkJsDocs = function (jsDocs) {
        var _this = this;
        return jsDocs
            .filter(function (x) { return x.tags && x.tags.length > 0; })
            .some(function (x) { return _this.checkJsDocTags(x.tags); });
    };
    JsDocHelper.prototype.checkJsDocTags = function (tags) {
        return tags.some(function (x) { return x.tagName && x.tagName.text === 'internal'; });
    };
    return JsDocHelper;
}());
exports.JsDocHelper = JsDocHelper;
//# sourceMappingURL=js-doc-helper.js.map