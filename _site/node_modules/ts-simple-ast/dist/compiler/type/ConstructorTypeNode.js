"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("../base");
var TypeNode_1 = require("./TypeNode");
exports.ConstructorTypeNodeBase = base_1.SignaturedDeclaration(TypeNode_1.TypeNode);
var ConstructorTypeNode = /** @class */ (function (_super) {
    tslib_1.__extends(ConstructorTypeNode, _super);
    function ConstructorTypeNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ConstructorTypeNode;
}(exports.ConstructorTypeNodeBase));
exports.ConstructorTypeNode = ConstructorTypeNode;
