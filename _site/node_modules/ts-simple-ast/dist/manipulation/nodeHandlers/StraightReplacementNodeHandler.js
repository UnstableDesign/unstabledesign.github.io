"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors = require("../../errors");
var utils_1 = require("../../utils");
var NodeHandlerHelper_1 = require("./NodeHandlerHelper");
/**
 * Replacement handler for replacing parts of the tree that should be equal.
 */
var StraightReplacementNodeHandler = /** @class */ (function () {
    function StraightReplacementNodeHandler(compilerFactory) {
        this.compilerFactory = compilerFactory;
        this.helper = new NodeHandlerHelper_1.NodeHandlerHelper(compilerFactory);
    }
    StraightReplacementNodeHandler.prototype.handleNode = function (currentNode, newNode, newSourceFile) {
        var e_1, _a;
        /* istanbul ignore if */
        if (currentNode.getKind() !== newNode.kind)
            throw new errors.InvalidOperationError("Error replacing tree! Perhaps a syntax error was inserted " +
                ("(Current: " + currentNode.getKindName() + " -- New: " + utils_1.getSyntaxKindName(newNode.kind) + ")."));
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
        /* istanbul ignore if */
        if (!newNodeChildren.next().done)
            throw new Error("Error replacing tree: Should not have new children left over.");
        this.compilerFactory.replaceCompilerNode(currentNode, newNode);
    };
    return StraightReplacementNodeHandler;
}());
exports.StraightReplacementNodeHandler = StraightReplacementNodeHandler;
