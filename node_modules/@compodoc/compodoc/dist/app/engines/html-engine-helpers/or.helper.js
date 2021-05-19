"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OrHelper = /** @class */ (function () {
    function OrHelper() {
    }
    OrHelper.prototype.helperFunc = function (context) {
        var len = arguments.length - 1;
        var options = arguments[len];
        // We start at 1 because of options
        for (var i = 1; i < len; i++) {
            if (arguments[i]) {
                return options.fn(context);
            }
        }
        return options.inverse(context);
    };
    return OrHelper;
}());
exports.OrHelper = OrHelper;
//# sourceMappingURL=or.helper.js.map