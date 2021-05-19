"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("../base");
var PrimaryExpression_1 = require("../expression/PrimaryExpression");
exports.IdentifierBase = base_1.ReferenceFindableNode(PrimaryExpression_1.PrimaryExpression);
var Identifier = /** @class */ (function (_super) {
    tslib_1.__extends(Identifier, _super);
    function Identifier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets the text for the identifier.
     */
    Identifier.prototype.getText = function () {
        return this.compilerNode.text;
    };
    /**
     * Renames the identifier.
     * @param newName - New name of the identifier.
     */
    Identifier.prototype.rename = function (newName) {
        this.global.languageService.renameNode(this, newName);
    };
    /**
     * Gets the definition nodes of the identifier.
     * @remarks This is similar to "go to definition" and `.getDefinitions()`, but only returns the nodes.
     */
    Identifier.prototype.getDefinitionNodes = function () {
        return this.getDefinitions().map(function (d) { return d.getDeclarationNode(); }).filter(function (d) { return d != null; });
    };
    /**
     * Gets the definitions of the identifier.
     * @remarks This is similar to "go to definition." Use `.getDefinitionNodes()` if you only care about the nodes.
     */
    Identifier.prototype.getDefinitions = function () {
        return this.global.languageService.getDefinitions(this);
    };
    /**
     * Gets the implementations of the identifier.
     *
     * This is similar to "go to implementation."
     */
    Identifier.prototype.getImplementations = function () {
        return this.global.languageService.getImplementations(this);
    };
    return Identifier;
}(exports.IdentifierBase));
exports.Identifier = Identifier;
