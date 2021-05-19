"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var utils_1 = require("../../utils");
var NodeHandlerHelper_1 = require("./NodeHandlerHelper");
/**
 * Replacement handler that goes through the tree and forgets any nodes that have changed kind.
 */
var ForgetChangedNodeHandler = /** @class */ (function () {
    function ForgetChangedNodeHandler(compilerFactory) {
        this.compilerFactory = compilerFactory;
        this.helper = new NodeHandlerHelper_1.NodeHandlerHelper(compilerFactory);
    }
    ForgetChangedNodeHandler.prototype.handleNode = function (currentNode, newNode, newSourceFile) {
        var e_1, _a;
        if (currentNode.getKind() !== newNode.kind) {
            currentNode.forget();
            return;
        }
        var newNodeChildren = utils_1.ArrayUtils.toIterator(newNode.getChildren(newSourceFile));
        try {
            for (var _b = tslib_1.__values(currentNode.getCompilerChildren()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var currentNodeChild = _c.value;
                this.helper.handleForValues(this, currentNodeChild, newNodeChildren.next().value, newSourceFile);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.compilerFactory.replaceCompilerNode(currentNode, newNode);
    };
    return ForgetChangedNodeHandler;
}());
exports.ForgetChangedNodeHandler = ForgetChangedNodeHandler;
