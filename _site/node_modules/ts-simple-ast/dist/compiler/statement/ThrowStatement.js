"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Statement_1 = require("./Statement");
exports.ThrowStatementBase = Statement_1.Statement;
var ThrowStatement = /** @class */ (function (_super) {
    tslib_1.__extends(ThrowStatement, _super);
    function ThrowStatement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets this do statement's expression.
     */
    ThrowStatement.prototype.getExpression = function () {
        return this.getNodeFromCompilerNode(this.compilerNode.expression);
    };
    return ThrowStatement;
}(exports.ThrowStatementBase));
exports.ThrowStatement = ThrowStatement;
