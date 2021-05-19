"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
function kindToType(kind) {
    var _type = '';
    switch (kind) {
        case ts.SyntaxKind.StringKeyword:
            _type = 'string';
            break;
        case ts.SyntaxKind.NumberKeyword:
            _type = 'number';
            break;
        case ts.SyntaxKind.ArrayType:
        case ts.SyntaxKind.ArrayLiteralExpression:
            _type = '[]';
            break;
        case ts.SyntaxKind.VoidKeyword:
            _type = 'void';
            break;
        case ts.SyntaxKind.FunctionType:
            _type = 'function';
            break;
        case ts.SyntaxKind.TypeLiteral:
            _type = 'literal type';
            break;
        case ts.SyntaxKind.BooleanKeyword:
            _type = 'boolean';
            break;
        case ts.SyntaxKind.AnyKeyword:
            _type = 'any';
            break;
        case ts.SyntaxKind.NullKeyword:
            _type = 'null';
            break;
        case ts.SyntaxKind.NeverKeyword:
            _type = 'never';
            break;
        case ts.SyntaxKind.UndefinedKeyword:
            _type = 'undefined';
            break;
        case ts.SyntaxKind.ObjectKeyword:
        case ts.SyntaxKind.ObjectLiteralExpression:
            _type = 'object';
            break;
    }
    return _type;
}
exports.kindToType = kindToType;
//# sourceMappingURL=kind-to-type.js.map