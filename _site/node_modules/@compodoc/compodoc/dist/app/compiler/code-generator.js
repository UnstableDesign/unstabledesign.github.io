"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var CodeGenerator = /** @class */ (function () {
    function CodeGenerator() {
    }
    CodeGenerator.prototype.generate = function (node) {
        return this.visitAndRecognize(node, []).join('');
    };
    CodeGenerator.prototype.visitAndRecognize = function (node, code, depth) {
        var _this = this;
        if (depth === void 0) { depth = 0; }
        this.recognize(node, code);
        node.getChildren().forEach(function (c) { return _this.visitAndRecognize(c, code, depth + 1); });
        return code;
    };
    CodeGenerator.prototype.recognize = function (node, code) {
        var _this = this;
        var conversion = TsKindConversion.find(function (x) { return x.kinds.some(function (z) { return z === node.kind; }); });
        if (conversion) {
            var result = conversion.output(node);
            result.forEach(function (text) { return _this.gen(text, code); });
        }
    };
    CodeGenerator.prototype.gen = function (token, code) {
        if (!token) {
            return;
        }
        if (token === '\n') {
            code.push('');
        }
        else {
            code.push(token);
        }
    };
    return CodeGenerator;
}());
exports.CodeGenerator = CodeGenerator;
var TsKindsToText = /** @class */ (function () {
    function TsKindsToText(output, kinds) {
        this.output = output;
        this.kinds = kinds;
    }
    return TsKindsToText;
}());
var TsKindConversion = [
    new TsKindsToText(function (node) { return ['\"', node.text, '\"']; }, [ts.SyntaxKind.FirstLiteralToken, ts.SyntaxKind.Identifier]),
    new TsKindsToText(function (node) { return ['\"', node.text, '\"']; }, [ts.SyntaxKind.StringLiteral]),
    new TsKindsToText(function (node) { return []; }, [ts.SyntaxKind.ArrayLiteralExpression]),
    new TsKindsToText(function (node) { return ['import', ' ']; }, [ts.SyntaxKind.ImportKeyword]),
    new TsKindsToText(function (node) { return ['from', ' ']; }, [ts.SyntaxKind.FromKeyword]),
    new TsKindsToText(function (node) { return ['\n', 'export', ' ']; }, [ts.SyntaxKind.ExportKeyword]),
    new TsKindsToText(function (node) { return ['class', ' ']; }, [ts.SyntaxKind.ClassKeyword]),
    new TsKindsToText(function (node) { return ['this']; }, [ts.SyntaxKind.ThisKeyword]),
    new TsKindsToText(function (node) { return ['constructor']; }, [ts.SyntaxKind.ConstructorKeyword]),
    new TsKindsToText(function (node) { return ['false']; }, [ts.SyntaxKind.FalseKeyword]),
    new TsKindsToText(function (node) { return ['true']; }, [ts.SyntaxKind.TrueKeyword]),
    new TsKindsToText(function (node) { return ['null']; }, [ts.SyntaxKind.NullKeyword]),
    new TsKindsToText(function (node) { return []; }, [ts.SyntaxKind.AtToken]),
    new TsKindsToText(function (node) { return ['+']; }, [ts.SyntaxKind.PlusToken]),
    new TsKindsToText(function (node) { return [' => ']; }, [ts.SyntaxKind.EqualsGreaterThanToken]),
    new TsKindsToText(function (node) { return ['(']; }, [ts.SyntaxKind.OpenParenToken]),
    new TsKindsToText(function (node) { return ['{', ' ']; }, [ts.SyntaxKind.ImportClause, ts.SyntaxKind.ObjectLiteralExpression]),
    new TsKindsToText(function (node) { return ['{', '\n']; }, [ts.SyntaxKind.Block]),
    new TsKindsToText(function (node) { return ['}']; }, [ts.SyntaxKind.CloseBraceToken]),
    new TsKindsToText(function (node) { return [')']; }, [ts.SyntaxKind.CloseParenToken]),
    new TsKindsToText(function (node) { return ['[']; }, [ts.SyntaxKind.OpenBracketToken]),
    new TsKindsToText(function (node) { return [']']; }, [ts.SyntaxKind.CloseBracketToken]),
    new TsKindsToText(function (node) { return [';', '\n']; }, [ts.SyntaxKind.SemicolonToken]),
    new TsKindsToText(function (node) { return [',', ' ']; }, [ts.SyntaxKind.CommaToken]),
    new TsKindsToText(function (node) { return [' ', ':', ' ']; }, [ts.SyntaxKind.ColonToken]),
    new TsKindsToText(function (node) { return ['.']; }, [ts.SyntaxKind.DotToken]),
    new TsKindsToText(function (node) { return []; }, [ts.SyntaxKind.DoStatement]),
    new TsKindsToText(function (node) { return []; }, [ts.SyntaxKind.Decorator]),
    new TsKindsToText(function (node) { return [' = ']; }, [ts.SyntaxKind.FirstAssignment]),
    new TsKindsToText(function (node) { return [' ']; }, [ts.SyntaxKind.FirstPunctuation]),
    new TsKindsToText(function (node) { return ['private', ' ']; }, [ts.SyntaxKind.PrivateKeyword]),
    new TsKindsToText(function (node) { return ['public', ' ']; }, [ts.SyntaxKind.PublicKeyword])
];
//# sourceMappingURL=code-generator.js.map