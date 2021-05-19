"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = require("../../typescript");
var NodeHandlerHelper = /** @class */ (function () {
    function NodeHandlerHelper(compilerFactory) {
        this.compilerFactory = compilerFactory;
    }
    NodeHandlerHelper.prototype.handleForValues = function (handler, currentNode, newNode, newSourceFile) {
        if (this.compilerFactory.hasCompilerNode(currentNode))
            handler.handleNode(this.compilerFactory.getExistingCompilerNode(currentNode), newNode, newSourceFile);
        else if (currentNode.kind === typescript_1.SyntaxKind.SyntaxList) {
            // always handle syntax lists because their children might be in the cache
            // todo: pass this in for performance reasons
            var sourceFile = this.compilerFactory.getExistingCompilerNode(currentNode.getSourceFile());
            handler.handleNode(this.compilerFactory.getNodeFromCompilerNode(currentNode, sourceFile), newNode, newSourceFile);
        }
    };
    NodeHandlerHelper.prototype.forgetNodeIfNecessary = function (currentNode) {
        if (this.compilerFactory.hasCompilerNode(currentNode))
            this.compilerFactory.getExistingCompilerNode(currentNode).forget();
    };
    return NodeHandlerHelper;
}());
exports.NodeHandlerHelper = NodeHandlerHelper;
