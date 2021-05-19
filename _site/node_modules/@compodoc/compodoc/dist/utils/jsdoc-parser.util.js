"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var _ = require("lodash");
var JsdocParserUtil = /** @class */ (function () {
    function JsdocParserUtil() {
    }
    JsdocParserUtil.prototype.isVariableLike = function (node) {
        if (node) {
            switch (node.kind) {
                case ts.SyntaxKind.BindingElement:
                case ts.SyntaxKind.EnumMember:
                case ts.SyntaxKind.Parameter:
                case ts.SyntaxKind.PropertyAssignment:
                case ts.SyntaxKind.PropertyDeclaration:
                case ts.SyntaxKind.PropertySignature:
                case ts.SyntaxKind.ShorthandPropertyAssignment:
                case ts.SyntaxKind.VariableDeclaration:
                    return true;
            }
        }
        return false;
    };
    JsdocParserUtil.prototype.getJSDocTags = function (node, kind) {
        var docs = this.getJSDocs(node);
        if (docs) {
            var result = [];
            for (var _i = 0, docs_1 = docs; _i < docs_1.length; _i++) {
                var doc = docs_1[_i];
                if (ts.isJSDocParameterTag(doc)) {
                    if (doc.kind === kind) {
                        result.push(doc);
                    }
                }
                else if (ts.isJSDoc(doc)) {
                    result.push.apply(result, _.filter(doc.tags, function (tag) { return tag.kind === kind; }));
                }
                else {
                    throw new Error('Unexpected type');
                }
            }
            return result;
        }
    };
    JsdocParserUtil.prototype.getJSDocs = function (node) {
        // TODO: jsDocCache is internal, see if there's a way around it
        var cache = node.jsDocCache;
        if (!cache) {
            cache = this.getJSDocsWorker(node, []).filter(function (x) { return x; });
            node.jsDocCache = cache;
        }
        return cache;
    };
    // Try to recognize this pattern when node is initializer
    // of variable declaration and JSDoc comments are on containing variable statement.
    // /**
    //   * @param {number} name
    //   * @returns {number}
    //   */
    // var x = function(name) { return name.length; }
    JsdocParserUtil.prototype.getJSDocsWorker = function (node, cache) {
        var parent = node.parent;
        var isInitializerOfVariableDeclarationInStatement = this.isVariableLike(parent) &&
            parent.initializer === node &&
            ts.isVariableStatement(parent.parent.parent);
        var isVariableOfVariableDeclarationStatement = this.isVariableLike(node) &&
            ts.isVariableStatement(parent.parent);
        var variableStatementNode = isInitializerOfVariableDeclarationInStatement ? parent.parent.parent :
            isVariableOfVariableDeclarationStatement ? parent.parent :
                undefined;
        if (variableStatementNode) {
            cache = this.getJSDocsWorker(variableStatementNode, cache);
        }
        // Also recognize when the node is the RHS of an assignment expression
        var isSourceOfAssignmentExpressionStatement = parent && parent.parent &&
            ts.isBinaryExpression(parent) &&
            parent.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
            ts.isExpressionStatement(parent.parent);
        if (isSourceOfAssignmentExpressionStatement) {
            cache = this.getJSDocsWorker(parent.parent, cache);
        }
        var isModuleDeclaration = ts.isModuleDeclaration(node) &&
            parent && ts.isModuleDeclaration(parent);
        var isPropertyAssignmentExpression = parent && ts.isPropertyAssignment(parent);
        if (isModuleDeclaration || isPropertyAssignmentExpression) {
            cache = this.getJSDocsWorker(parent, cache);
        }
        // Pull parameter comments from declaring function as well
        if (ts.isParameter(node)) {
            cache = _.concat(cache, this.getJSDocParameterTags(node));
        }
        if (this.isVariableLike(node) && node.initializer) {
            cache = _.concat(cache, node.initializer.jsDoc);
        }
        cache = _.concat(cache, node.jsDoc);
        return cache;
    };
    JsdocParserUtil.prototype.getJSDocParameterTags = function (param) {
        var func = param.parent;
        var tags = this.getJSDocTags(func, ts.SyntaxKind.JSDocParameterTag);
        if (!param.name) {
            // this is an anonymous jsdoc param from a `function(type1, type2): type3` specification
            var i = func.parameters.indexOf(param);
            var paramTags = _.filter(tags, function (tag) { return ts.isJSDocParameterTag(tag); });
            if (paramTags && 0 <= i && i < paramTags.length) {
                return [paramTags[i]];
            }
        }
        else if (ts.isIdentifier(param.name)) {
            var name_1 = param.name.text;
            return _.filter(tags, function (tag) {
                if (ts && ts.isJSDocParameterTag(tag)) {
                    var t = tag;
                    return t.parameterName.text === name_1;
                }
            });
        }
        else {
            // TODO: it's a destructured parameter, so it should look up an "object type" series of multiple lines
            // But multi-line object types aren't supported yet either
            return undefined;
        }
    };
    return JsdocParserUtil;
}());
exports.JsdocParserUtil = JsdocParserUtil;
//# sourceMappingURL=jsdoc-parser.util.js.map