"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var manipulation_1 = require("../../manipulation");
var base_1 = require("../base");
var callBaseFill_1 = require("../callBaseFill");
var common_1 = require("../common");
exports.ParameterDeclarationBase = base_1.QuestionTokenableNode(base_1.DecoratableNode(base_1.ScopeableNode(base_1.ReadonlyableNode(base_1.ModifierableNode(base_1.TypedNode(base_1.InitializerExpressionableNode(base_1.DeclarationNamedNode(common_1.Node))))))));
var ParameterDeclaration = /** @class */ (function (_super) {
    tslib_1.__extends(ParameterDeclaration, _super);
    function ParameterDeclaration() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Fills the node from a structure.
     * @param structure - Structure to fill.
     */
    ParameterDeclaration.prototype.fill = function (structure) {
        callBaseFill_1.callBaseFill(exports.ParameterDeclarationBase.prototype, this, structure);
        if (structure.isRestParameter != null)
            this.setIsRestParameter(structure.isRestParameter);
        return this;
    };
    /**
     * Gets the dot dot dot token (...) for a rest parameter.
     */
    ParameterDeclaration.prototype.getDotDotDotToken = function () {
        return this.getNodeFromCompilerNodeIfExists(this.compilerNode.dotDotDotToken);
    };
    /**
     * Gets if it's a rest parameter.
     */
    ParameterDeclaration.prototype.isRestParameter = function () {
        return this.compilerNode.dotDotDotToken != null;
    };
    /**
     * Gets if this is a parameter property.
     */
    ParameterDeclaration.prototype.isParameterProperty = function () {
        return this.getScope() != null || this.isReadonly();
    };
    /**
     * Sets if it's a rest parameter.
     * @param value - Sets if it's a rest parameter or not.
     */
    ParameterDeclaration.prototype.setIsRestParameter = function (value) {
        if (this.isRestParameter() === value)
            return this;
        if (value) {
            manipulation_1.insertIntoParentTextRange({
                insertPos: this.getNameNodeOrThrow().getStart(),
                parent: this,
                newText: "..."
            });
        }
        else
            manipulation_1.removeChildren({ children: [this.getDotDotDotToken()] });
        return this;
    };
    /**
     * Gets if it's optional.
     */
    ParameterDeclaration.prototype.isOptional = function () {
        return this.compilerNode.questionToken != null || this.isRestParameter() || this.hasInitializer();
    };
    /**
     * Remove this parameter.
     */
    ParameterDeclaration.prototype.remove = function () {
        manipulation_1.removeCommaSeparatedChild(this);
    };
    return ParameterDeclaration;
}(exports.ParameterDeclarationBase));
exports.ParameterDeclaration = ParameterDeclaration;
