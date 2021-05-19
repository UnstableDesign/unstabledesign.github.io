"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RelativeURLHelper = /** @class */ (function () {
    function RelativeURLHelper() {
    }
    RelativeURLHelper.prototype.helperFunc = function (context, currentDepth, options) {
        switch (currentDepth) {
            case 0:
                return './';
            case 1:
                return '../';
            case 2:
                return '../../';
        }
        return '';
    };
    return RelativeURLHelper;
}());
exports.RelativeURLHelper = RelativeURLHelper;
//# sourceMappingURL=relative-url.helper.js.map