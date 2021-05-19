"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("../base");
var expression_1 = require("../expression");
var statement_1 = require("../statement");
exports.ArrowFunctionBase = base_1.JSDocableNode(base_1.TextInsertableNode(base_1.BodiedNode(base_1.AsyncableNode(statement_1.StatementedNode(base_1.TypeParameteredNode(base_1.SignaturedDeclaration(base_1.ModifierableNode(expression_1.Expression))))))));
var ArrowFunction = /** @class */ (function (_super) {
    tslib_1.__extends(ArrowFunction, _super);
    function ArrowFunction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets the equals greater than token of the arrow function.
     */
    ArrowFunction.prototype.getEqualsGreaterThan = function () {
        return this.getNodeFromCompilerNode(this.compilerNode.equalsGreaterThanToken);
    };
    return ArrowFunction;
}(exports.ArrowFunctionBase));
exports.ArrowFunction = ArrowFunction;
