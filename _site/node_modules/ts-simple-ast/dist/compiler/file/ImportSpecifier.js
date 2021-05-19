"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var manipulation_1 = require("../../manipulation");
var typescript_1 = require("../../typescript");
var utils_1 = require("../../utils");
var common_1 = require("../common");
var ImportSpecifier = /** @class */ (function (_super) {
    tslib_1.__extends(ImportSpecifier, _super);
    function ImportSpecifier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Sets the identifier being imported.
     * @param name - Name being imported.
     */
    ImportSpecifier.prototype.setName = function (name) {
        var nameNode = this.getNameNode();
        if (nameNode.getText() === name)
            return this;
        var start = nameNode.getStart();
        manipulation_1.replaceNodeText({
            sourceFile: this.sourceFile,
            start: start,
            replacingLength: nameNode.getWidth(),
            newText: name
        });
        return this;
    };
    /**
     * Renames the identifier being imported.
     * @param name - New name.
     */
    ImportSpecifier.prototype.renameName = function (name) {
        this.getNameNode().rename(name);
        return this;
    };
    /**
     * Gets the name of the import specifier.
     */
    ImportSpecifier.prototype.getName = function () {
        return this.getNameNode().getText();
    };
    /**
     * Gets the name node of what's being imported.
     */
    ImportSpecifier.prototype.getNameNode = function () {
        return this.getFirstChildByKindOrThrow(typescript_1.SyntaxKind.Identifier);
    };
    /**
     * Sets the alias for the name being imported.
     * @param alias - Alias to set.
     */
    ImportSpecifier.prototype.setAlias = function (alias) {
        var aliasIdentifier = this.getAliasIdentifier();
        if (aliasIdentifier == null) {
            // trick is to insert an alias with the same name, then rename the alias. TS compiler will take care of the rest.
            var nameNode = this.getNameNode();
            manipulation_1.insertIntoParentTextRange({
                insertPos: nameNode.getEnd(),
                parent: this,
                newText: " as " + nameNode.getText()
            });
            aliasIdentifier = this.getAliasIdentifier();
        }
        aliasIdentifier.rename(alias);
        return this;
    };
    /**
     * Gets the alias identifier, if it exists.
     */
    ImportSpecifier.prototype.getAliasIdentifier = function () {
        var asKeyword = this.getFirstChildByKind(typescript_1.SyntaxKind.AsKeyword);
        if (asKeyword == null)
            return undefined;
        var aliasIdentifier = asKeyword.getNextSibling();
        if (aliasIdentifier == null || !(utils_1.TypeGuards.isIdentifier(aliasIdentifier)))
            return undefined;
        return aliasIdentifier;
    };
    /**
     * Gets the import declaration associated with this import specifier.
     */
    ImportSpecifier.prototype.getImportDeclaration = function () {
        return this.getFirstAncestorByKindOrThrow(typescript_1.SyntaxKind.ImportDeclaration);
    };
    /**
     * Remove the import specifier.
     */
    ImportSpecifier.prototype.remove = function () {
        var importDeclaration = this.getImportDeclaration();
        var namedImports = importDeclaration.getNamedImports();
        if (namedImports.length > 1)
            manipulation_1.removeCommaSeparatedChild(this);
        else
            importDeclaration.removeNamedImports();
    };
    return ImportSpecifier;
}(common_1.Node));
exports.ImportSpecifier = ImportSpecifier;
