"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var ts = require("typescript");
var ts_simple_ast_1 = require("ts-simple-ast");
var ast = new ts_simple_ast_1.default();
var ImportsUtil = /** @class */ (function () {
    function ImportsUtil() {
    }
    ImportsUtil.prototype.merge = function (variableName, sourceFile) {
        var metadataVariableName = variableName, searchedImport, aliasOriginalName = '', foundWithAlias = false;
        var file = (typeof ast.getSourceFile(sourceFile.fileName) !== 'undefined') ? ast.getSourceFile(sourceFile.fileName) : ast.addSourceFileFromText(sourceFile.fileName, sourceFile.getText());
        var imports = file.getImports();
        /**
         * Loop through all imports, and find one matching variableName
         */
        imports.forEach(function (i) {
            var namedImports = i.getNamedImports(), namedImportsLength = namedImports.length, j = 0;
            if (namedImportsLength > 0) {
                for (j; j < namedImportsLength; j++) {
                    var importName = namedImports[j].getNameIdentifier().getText(), importAlias = void 0;
                    if (namedImports[j].getAliasIdentifier()) {
                        importAlias = namedImports[j].getAliasIdentifier().getText();
                    }
                    if (importName === metadataVariableName) {
                        searchedImport = i;
                        break;
                    }
                    if (importAlias === metadataVariableName) {
                        foundWithAlias = true;
                        aliasOriginalName = importName;
                        searchedImport = i;
                        break;
                    }
                }
            }
        });
        if (searchedImport) {
            var imporPath = path.resolve(path.dirname(sourceFile.fileName) + '/' + searchedImport.getModuleSpecifier() + '.ts');
            var sourceFileImport = ast.getOrAddSourceFile(imporPath);
            if (sourceFileImport) {
                var variableName_1 = (foundWithAlias) ? aliasOriginalName : metadataVariableName;
                var variableDeclaration = sourceFileImport.getVariableDeclaration(variableName_1);
                if (variableDeclaration) {
                    var variableKind = variableDeclaration.getKind();
                    if (variableKind && variableKind === ts.SyntaxKind.VariableDeclaration) {
                        var initializer = variableDeclaration.getInitializer();
                        if (initializer) {
                            var initializerKind = initializer.getKind();
                            if (initializerKind && initializerKind === ts.SyntaxKind.ObjectLiteralExpression) {
                                var compilerNode = initializer.compilerNode;
                                return compilerNode.properties;
                            }
                        }
                    }
                }
            }
        }
        return [];
    };
    return ImportsUtil;
}());
exports.ImportsUtil = ImportsUtil;
//# sourceMappingURL=imports.util.js.map