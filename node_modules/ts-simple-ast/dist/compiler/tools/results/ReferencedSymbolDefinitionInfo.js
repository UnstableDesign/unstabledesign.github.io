"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var utils_1 = require("../../../utils");
var DefinitionInfo_1 = require("./DefinitionInfo");
var ReferencedSymbolDefinitionInfo = /** @class */ (function (_super) {
    tslib_1.__extends(ReferencedSymbolDefinitionInfo, _super);
    /**
     * @internal
     */
    function ReferencedSymbolDefinitionInfo(global, compilerObject) {
        return _super.call(this, global, compilerObject) || this;
    }
    /**
     * Gets the display parts.
     */
    ReferencedSymbolDefinitionInfo.prototype.getDisplayParts = function () {
        var _this = this;
        return this.compilerObject.displayParts.map(function (p) { return _this.global.compilerFactory.getSymbolDisplayPart(p); });
    };
    tslib_1.__decorate([
        utils_1.Memoize
    ], ReferencedSymbolDefinitionInfo.prototype, "getDisplayParts", null);
    return ReferencedSymbolDefinitionInfo;
}(DefinitionInfo_1.DefinitionInfo));
exports.ReferencedSymbolDefinitionInfo = ReferencedSymbolDefinitionInfo;
