"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var ModifIconHelper = /** @class */ (function () {
    function ModifIconHelper() {
    }
    ModifIconHelper.prototype.helperFunc = function (context, kind) {
        var _kindText = '';
        switch (kind) {
            case ts.SyntaxKind.PrivateKeyword:
                _kindText = 'lock'; // private
                break;
            case ts.SyntaxKind.ProtectedKeyword:
                _kindText = 'lock'; // protected
                break;
            case ts.SyntaxKind.StaticKeyword:
                _kindText = 'reset'; // static
                break;
            case ts.SyntaxKind.ExportKeyword:
                _kindText = 'export'; // export
                break;
            default:
                _kindText = 'reset';
                break;
        }
        return _kindText;
    };
    return ModifIconHelper;
}());
exports.ModifIconHelper = ModifIconHelper;
//# sourceMappingURL=modif-icon.helper.js.map