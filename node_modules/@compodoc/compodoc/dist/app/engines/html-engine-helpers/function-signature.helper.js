"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../utils");
var FunctionSignatureHelper = /** @class */ (function () {
    function FunctionSignatureHelper(configuration, dependenciesEngine) {
        this.configuration = configuration;
        this.dependenciesEngine = dependenciesEngine;
        this.angularVersionUtil = new utils_1.AngularVersionUtil();
        this.basicTypeUtil = new utils_1.BasicTypeUtil();
    }
    FunctionSignatureHelper.prototype.handleFunction = function (arg) {
        var _this = this;
        if (arg.function.length === 0) {
            return "" + arg.name + this.getOptionalString(arg) + ": () => void";
        }
        var argums = arg.function.map(function (argu) {
            var _result = _this.dependenciesEngine.find(argu.type);
            if (_result) {
                if (_result.source === 'internal') {
                    var path = _result.data.type;
                    if (_result.data.type === 'class') {
                        path = 'classe';
                    }
                    return "" + argu.name + _this.getOptionalString(arg) + ": <a href=\"../" + path + "s/" + _result.data.name + ".html\">" + argu.type + "</a>";
                }
                else {
                    var path = _this.angularVersionUtil.getApiLink(_result.data, _this.configuration.mainData.angularVersion);
                    return "" + argu.name + _this.getOptionalString(arg) + ": <a href=\"" + path + "\" target=\"_blank\">" + argu.type + "</a>";
                }
            }
            else if (_this.basicTypeUtil.isKnownType(argu.type)) {
                var path = _this.basicTypeUtil.getTypeUrl(argu.type);
                return "" + argu.name + _this.getOptionalString(arg) + ": <a href=\"" + path + "\" target=\"_blank\">" + argu.type + "</a>";
            }
            else {
                if (argu.name && argu.type) {
                    return "" + argu.name + _this.getOptionalString(arg) + ": " + argu.type;
                }
                else {
                    return "" + argu.name.text;
                }
            }
        });
        return "" + arg.name + this.getOptionalString(arg) + ": (" + argums + ") => void";
    };
    FunctionSignatureHelper.prototype.getOptionalString = function (arg) {
        return arg.optional ? '?' : '';
    };
    FunctionSignatureHelper.prototype.helperFunc = function (context, method) {
        var _this = this;
        var args = [];
        if (method.args) {
            args = method.args.map(function (arg) {
                var _result = _this.dependenciesEngine.find(arg.type);
                if (_result) {
                    if (_result.source === 'internal') {
                        var path = _result.data.type;
                        if (_result.data.type === 'class') {
                            path = 'classe';
                        }
                        return "" + arg.name + _this.getOptionalString(arg) + ": <a href=\"../" + path + "s/" + _result.data.name + ".html\">" + arg.type + "</a>";
                    }
                    else {
                        var path = _this.angularVersionUtil.getApiLink(_result.data, _this.configuration.mainData.angularVersion);
                        return "" + arg.name + _this.getOptionalString(arg) + ": <a href=\"" + path + "\" target=\"_blank\">" + arg.type + "</a>";
                    }
                }
                else if (arg.dotDotDotToken) {
                    return "..." + arg.name + ": " + arg.type;
                }
                else if (arg.function) {
                    return _this.handleFunction(arg);
                }
                else if (_this.basicTypeUtil.isKnownType(arg.type)) {
                    var path = _this.basicTypeUtil.getTypeUrl(arg.type);
                    return "" + arg.name + _this.getOptionalString(arg) + ": <a href=\"" + path + "\" target=\"_blank\">" + arg.type + "</a>";
                }
                else {
                    return "" + arg.name + _this.getOptionalString(arg) + ": " + arg.type;
                }
            }).join(', ');
        }
        if (method.name) {
            return method.name + "(" + args + ")";
        }
        else {
            return "(" + args + ")";
        }
    };
    return FunctionSignatureHelper;
}());
exports.FunctionSignatureHelper = FunctionSignatureHelper;
//# sourceMappingURL=function-signature.helper.js.map