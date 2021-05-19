"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors = require("../../../errors");
var callBaseFill_1 = require("../../callBaseFill");
var ReferenceFindableNode_1 = require("./ReferenceFindableNode");
function NamedNode(Base) {
    return NamedNodeInternal(ReferenceFindableNode_1.ReferenceFindableNode(Base));
}
exports.NamedNode = NamedNode;
function NamedNodeInternal(Base) {
    return /** @class */ (function (_super) {
        tslib_1.__extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.getNameNode = function () {
            return this.getNodeFromCompilerNode(this.compilerNode.name);
        };
        class_1.prototype.getName = function () {
            return this.getNameNode().getText();
        };
        class_1.prototype.rename = function (newName) {
            if (newName === this.getName())
                return this;
            errors.throwIfNotStringOrWhitespace(newName, "newName");
            this.getNameNode().rename(newName);
            return this;
        };
        class_1.prototype.fill = function (structure) {
            callBaseFill_1.callBaseFill(Base.prototype, this, structure);
            if (structure.name != null)
                this.rename(structure.name);
            return this;
        };
        return class_1;
    }(Base));
}
exports.NamedNodeInternal = NamedNodeInternal;
