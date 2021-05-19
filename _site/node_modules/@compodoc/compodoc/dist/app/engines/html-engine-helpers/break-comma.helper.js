"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Handlebars = require("handlebars");
var BreakCommaHelper = /** @class */ (function () {
    function BreakCommaHelper(bars) {
        this.bars = bars;
    }
    BreakCommaHelper.prototype.helperFunc = function (context, text) {
        text = this.bars.Utils.escapeExpression(text);
        text = text.replace(/,/g, ',<br>');
        return new Handlebars.SafeString(text);
    };
    return BreakCommaHelper;
}());
exports.BreakCommaHelper = BreakCommaHelper;
//# sourceMappingURL=break-comma.helper.js.map