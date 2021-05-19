"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Handlebars = require("handlebars");
var CleanParagraphHelper = /** @class */ (function () {
    function CleanParagraphHelper() {
    }
    CleanParagraphHelper.prototype.helperFunc = function (context, text) {
        text = text.replace(/<p>/gm, '');
        text = text.replace(/<\/p>/gm, '');
        return new Handlebars.SafeString(text);
    };
    return CleanParagraphHelper;
}());
exports.CleanParagraphHelper = CleanParagraphHelper;
//# sourceMappingURL=clean-paragraph.helper.js.map