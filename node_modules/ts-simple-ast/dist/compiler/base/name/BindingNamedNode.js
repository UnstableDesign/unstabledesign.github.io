"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors = require("../../../errors");
var typescript_1 = require("../../../typescript");
var ReferenceFindableNode_1 = require("./ReferenceFindableNode");
function BindingNamedNode(Base) {
    return BindingNamedNodeInternal(ReferenceFindableNode_1.ReferenceFindableNode(Base));
}
exports.BindingNamedNode = BindingNamedNode;
function BindingNamedNodeInternal(Base) {
    return /** @class */ (function (_super) {
        tslib_1.__extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.getNameNode = function () {
            var compilerNameNode = this.compilerNode.name;
            switch (compilerNameNode.kind) {
                case typescript_1.SyntaxKind.Identifier:
                    return this.getNodeFromCompilerNode(compilerNameNode);
                /* istanbul ignore next */
                default:
                    throw errors.getNotImplementedForSyntaxKindError(compilerNameNode.kind);
            }
        };
        class_1.prototype.getName = function () {
            return this.getNameNode().getText();
        };
        class_1.prototype.rename = function (text) {
            errors.throwIfNotStringOrWhitespace(text, "text");
            this.getNameNode().rename(text);
            return this;
        };
        return class_1;
    }(Base));
}
