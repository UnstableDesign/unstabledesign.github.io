"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("../base");
var TypeNode_1 = require("./TypeNode");
exports.FunctionTypeNodeBase = base_1.TypeParameteredNode(base_1.SignaturedDeclaration(TypeNode_1.TypeNode));
var FunctionTypeNode = /** @class */ (function (_super) {
    tslib_1.__extends(FunctionTypeNode, _super);
    function FunctionTypeNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FunctionTypeNode;
}(exports.FunctionTypeNodeBase));
exports.FunctionTypeNode = FunctionTypeNode;
