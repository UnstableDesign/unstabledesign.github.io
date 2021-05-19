"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Handlebars = require("handlebars");
var ts = require("typescript");
var ModifKindHelper = /** @class */ (function () {
    function ModifKindHelper() {
    }
    ModifKindHelper.prototype.helperFunc = function (context, kind) {
        var _kindText = '';
        switch (kind) {
            case ts.SyntaxKind.PrivateKeyword:
                _kindText = 'Private';
                break;
            case ts.SyntaxKind.ProtectedKeyword:
                _kindText = 'Protected';
                break;
            case ts.SyntaxKind.PublicKeyword:
                _kindText = 'Public';
                break;
            case ts.SyntaxKind.StaticKeyword:
                _kindText = 'Static';
                break;
        }
        return new Handlebars.SafeString(_kindText);
    };
    return ModifKindHelper;
}());
exports.ModifKindHelper = ModifKindHelper;
//# sourceMappingURL=modif-kind-helper.js.map