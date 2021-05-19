"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var TsPrinterUtil = /** @class */ (function () {
    function TsPrinterUtil() {
        this.printer = ts.createPrinter({
            newLine: ts.NewLineKind.LineFeed
        });
    }
    TsPrinterUtil.prototype.print = function (node) {
        return this.printer.printNode(ts.EmitHint.Unspecified, node, ts.createSourceFile('', '', ts.ScriptTarget.Latest));
    };
    return TsPrinterUtil;
}());
exports.TsPrinterUtil = TsPrinterUtil;
//# sourceMappingURL=ts-printer.util.js.map