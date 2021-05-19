"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var link_parser_1 = require("../../../utils/link-parser");
var ParseDescriptionHelper = /** @class */ (function () {
    function ParseDescriptionHelper(dependenciesEngine) {
        this.dependenciesEngine = dependenciesEngine;
    }
    ParseDescriptionHelper.prototype.helperFunc = function (context, description, depth) {
        var _this = this;
        var tagRegExpLight = new RegExp('\\{@link\\s+((?:.|\n)+?)\\}', 'i');
        var tagRegExpFull = new RegExp('\\{@link\\s+((?:.|\n)+?)\\}', 'i');
        var tagRegExp;
        var matches;
        var previousString;
        var tagInfo = [];
        tagRegExp = (description.indexOf(']{') !== -1) ? tagRegExpFull : tagRegExpLight;
        var processTheLink = function (string, tagInfo, leadingText) {
            var leading = link_parser_1.extractLeadingText(string, tagInfo.completeTag);
            var split;
            var result;
            var newLink;
            var rootPath;
            var stringtoReplace;
            var anchor = '';
            split = link_parser_1.splitLinkText(tagInfo.text);
            if (typeof split.linkText !== 'undefined') {
                result = _this.dependenciesEngine.findInCompodoc(split.target);
            }
            else {
                var info = tagInfo.text;
                if (tagInfo.text.indexOf('#') !== -1) {
                    anchor = tagInfo.text.substr(tagInfo.text.indexOf('#'), tagInfo.text.length);
                    info = tagInfo.text.substr(0, tagInfo.text.indexOf('#'));
                }
                result = _this.dependenciesEngine.findInCompodoc(info);
            }
            if (result) {
                if (leadingText) {
                    stringtoReplace = '[' + leadingText + ']' + tagInfo.completeTag;
                }
                else if (leading.leadingText !== undefined) {
                    stringtoReplace = '[' + leading.leadingText + ']' + tagInfo.completeTag;
                }
                else if (typeof split.linkText !== 'undefined') {
                    stringtoReplace = tagInfo.completeTag;
                }
                else {
                    stringtoReplace = tagInfo.completeTag;
                }
                if (result.type === 'class') {
                    result.type = 'classe';
                }
                rootPath = '';
                switch (depth) {
                    case 0:
                        rootPath = './';
                        break;
                    case 1:
                        rootPath = '../';
                        break;
                    case 2:
                        rootPath = '../../';
                        break;
                }
                var label = result.name;
                if (leading.leadingText !== undefined) {
                    label = leading.leadingText;
                }
                if (typeof split.linkText !== 'undefined') {
                    label = split.linkText;
                }
                newLink = "<a href=\"" + rootPath + result.type + "s/" + result.name + ".html" + anchor + "\">" + label + "</a>";
                return string.replace(stringtoReplace, newLink);
            }
            else {
                return string;
            }
        };
        function replaceMatch(replacer, tag, match, text, linkText) {
            var matchedTag = {
                completeTag: match,
                tag: tag,
                text: text
            };
            tagInfo.push(matchedTag);
            if (linkText) {
                return replacer(description, matchedTag, linkText);
            }
            else {
                return replacer(description, matchedTag);
            }
        }
        do {
            matches = tagRegExp.exec(description);
            if (matches) {
                previousString = description;
                if (matches.length === 2) {
                    description = replaceMatch(processTheLink, 'link', matches[0], matches[1]);
                }
                if (matches.length === 3) {
                    description = replaceMatch(processTheLink, 'link', matches[0], matches[2], matches[1]);
                }
            }
        } while (matches && previousString !== description);
        return description;
    };
    return ParseDescriptionHelper;
}());
exports.ParseDescriptionHelper = ParseDescriptionHelper;
//# sourceMappingURL=parse-description.helper.js.map