"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IfStringHelper = /** @class */ (function () {
    function IfStringHelper() {
    }
    IfStringHelper.prototype.helperFunc = function (context, a, options) {
        if (typeof a === 'string') {
            return options.fn(context);
        }
        return options.inverse(context);
    };
    return IfStringHelper;
}());
exports.IfStringHelper = IfStringHelper;
//# sourceMappingURL=if-string.helper.js.map