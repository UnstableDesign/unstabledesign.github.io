"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IsNotToggleHelper = /** @class */ (function () {
    function IsNotToggleHelper(configuration) {
        this.configuration = configuration;
    }
    IsNotToggleHelper.prototype.helperFunc = function (context, type, options) {
        var result = this.configuration.mainData.toggleMenuItems.indexOf(type);
        if (this.configuration.mainData.toggleMenuItems.indexOf('all') !== -1) {
            return options.inverse(context);
        }
        else if (result === -1) {
            return options.fn(context);
        }
        else {
            return options.inverse(context);
        }
    };
    return IsNotToggleHelper;
}());
exports.IsNotToggleHelper = IsNotToggleHelper;
//# sourceMappingURL=is-not-toggle.helper.js.map