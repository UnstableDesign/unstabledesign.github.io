"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors = require("../../errors");
var manipulation_1 = require("../../manipulation");
var typescript_1 = require("../../typescript");
var utils_1 = require("../../utils");
var callBaseFill_1 = require("../callBaseFill");
function TypedNode(Base) {
    return /** @class */ (function (_super) {
        tslib_1.__extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.getTypeNode = function () {
            return this.getNodeFromCompilerNodeIfExists(this.compilerNode.type);
        };
        class_1.prototype.getTypeNodeOrThrow = function () {
            return errors.throwIfNullOrUndefined(this.getTypeNode(), "Expected to find a type node.");
        };
        class_1.prototype.setType = function (textOrWriterFunction) {
            var text = utils_1.getTextFromStringOrWriter(this.getWriterWithQueuedChildIndentation(), textOrWriterFunction);
            if (utils_1.StringUtils.isNullOrWhitespace(text))
                return this.removeType();
            var typeNode = this.getTypeNode();
            if (typeNode != null && typeNode.getText() === text)
                return this;
            // remove previous type
            var separatorSyntaxKind = getSeparatorSyntaxKindForNode(this);
            var separatorNode = this.getFirstChildByKind(separatorSyntaxKind);
            var insertPos;
            var newText;
            if (separatorNode == null) {
                var identifier = this.getFirstChildByKindOrThrow(typescript_1.SyntaxKind.Identifier);
                insertPos = identifier.getEnd();
                newText = (separatorSyntaxKind === typescript_1.SyntaxKind.EqualsToken ? " = " : ": ") + text;
            }
            else {
                insertPos = typeNode.getStart();
                newText = text;
            }
            // insert new type
            manipulation_1.insertIntoParentTextRange({
                parent: this,
                insertPos: insertPos,
                newText: newText,
                replacing: {
                    textLength: typeNode == null ? 0 : typeNode.getWidth()
                }
            });
            return this;
        };
        class_1.prototype.fill = function (structure) {
            callBaseFill_1.callBaseFill(Base.prototype, this, structure);
            if (structure.type != null)
                this.setType(structure.type);
            return this;
        };
        class_1.prototype.removeType = function () {
            if (this.getKind() === typescript_1.SyntaxKind.TypeAliasDeclaration)
                throw new errors.NotSupportedError("Cannot remove the type of a type alias. Use " + "setType" + " instead.");
            var typeNode = this.getTypeNode();
            if (typeNode == null)
                return this;
            var separatorToken = typeNode.getPreviousSiblingIfKindOrThrow(getSeparatorSyntaxKindForNode(this));
            manipulation_1.removeChildren({ children: [separatorToken, typeNode], removePrecedingSpaces: true });
            return this;
        };
        return class_1;
    }(Base));
}
exports.TypedNode = TypedNode;
function getSeparatorSyntaxKindForNode(node) {
    switch (node.getKind()) {
        case typescript_1.SyntaxKind.TypeAliasDeclaration:
            return typescript_1.SyntaxKind.EqualsToken;
        default:
            return typescript_1.SyntaxKind.ColonToken;
    }
}
