"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../utils");
var LinkTypeHelper = /** @class */ (function () {
    function LinkTypeHelper(configuration, dependenciesEngine) {
        this.configuration = configuration;
        this.dependenciesEngine = dependenciesEngine;
        this.angularVersionUtil = new utils_1.AngularVersionUtil();
        this.basicTypeUtil = new utils_1.BasicTypeUtil();
    }
    LinkTypeHelper.prototype.helperFunc = function (context, name, options) {
        var _result = this.dependenciesEngine.find(name);
        var angularDocPrefix = this.angularVersionUtil.prefixOfficialDoc(this.configuration.mainData.angularVersion);
        if (_result) {
            context.type = {
                raw: name
            };
            if (_result.source === 'internal') {
                if (_result.data.type === 'class') {
                    _result.data.type = 'classe';
                }
                context.type.href = '../' + _result.data.type + 's/' + _result.data.name + '.html';
                if (_result.data.type === 'miscellaneous') {
                    var mainpage = '';
                    switch (_result.data.subtype) {
                        case 'enum':
                            mainpage = 'enumerations';
                            break;
                        case 'function':
                            mainpage = 'functions';
                            break;
                        case 'typealias':
                            mainpage = 'typealiases';
                            break;
                        case 'variable':
                            mainpage = 'variables';
                    }
                    context.type.href = '../' + _result.data.type + '/' + mainpage + '.html#' + _result.data.name;
                }
                context.type.target = '_self';
            }
            else {
                context.type.href = "https://" + angularDocPrefix + "angular.io/" + _result.data.path;
                context.type.target = '_blank';
            }
            return options.fn(context);
        }
        else if (this.basicTypeUtil.isKnownType(name)) {
            context.type = {
                raw: name
            };
            context.type.target = '_blank';
            context.type.href = this.basicTypeUtil.getTypeUrl(name);
            return options.fn(context);
        }
        else {
            return options.inverse(context);
        }
    };
    return LinkTypeHelper;
}());
exports.LinkTypeHelper = LinkTypeHelper;
//# sourceMappingURL=link-type.helper.js.map