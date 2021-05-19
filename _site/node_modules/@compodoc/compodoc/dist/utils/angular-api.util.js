"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var AngularAPIs = require('../src/data/api-list.json');
var AngularApiUtil = /** @class */ (function () {
    function AngularApiUtil() {
    }
    AngularApiUtil.prototype.findApi = function (type) {
        var foundedApi;
        _.forEach(AngularAPIs, function (mainApi) {
            _.forEach(mainApi.items, function (api) {
                if (api.title === type) {
                    foundedApi = api;
                }
            });
        });
        return {
            source: 'external',
            data: foundedApi
        };
    };
    return AngularApiUtil;
}());
exports.AngularApiUtil = AngularApiUtil;
//# sourceMappingURL=angular-api.util.js.map