"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Handlebars = require("handlebars");
var ObjectHelper = /** @class */ (function () {
    function ObjectHelper() {
    }
    ObjectHelper.prototype.helperFunc = function (context, text) {
        text = JSON.stringify(text);
        text = text.replace(/{"/, '{<br>&nbsp;&nbsp;&nbsp;&nbsp;"');
        text = text.replace(/,"/, ',<br>&nbsp;&nbsp;&nbsp;&nbsp;"');
        text = text.replace(/}$/, '<br>}');
        return new Handlebars.SafeString(text);
    };
    return ObjectHelper;
}());
exports.ObjectHelper = ObjectHelper;
//# sourceMappingURL=object.helper.js.map