"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EscapeSimpleQuoteHelper = /** @class */ (function () {
    function EscapeSimpleQuoteHelper() {
    }
    EscapeSimpleQuoteHelper.prototype.helperFunc = function (context, text) {
        if (!text) {
            return;
        }
        text = text.replace(/'/g, "\\'");
        text = text.replace(/(\r\n|\n|\r)/gm, '');
        return text;
    };
    return EscapeSimpleQuoteHelper;
}());
exports.EscapeSimpleQuoteHelper = EscapeSimpleQuoteHelper;
//# sourceMappingURL=escape-simple-quote.helper.js.map