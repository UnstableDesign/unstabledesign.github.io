"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsdocCodeExampleHelper = /** @class */ (function () {
    function JsdocCodeExampleHelper() {
    }
    JsdocCodeExampleHelper.prototype.cleanTag = function (comment) {
        if (comment.charAt(0) === '*') {
            comment = comment.substring(1, comment.length);
        }
        if (comment.charAt(0) === ' ') {
            comment = comment.substring(1, comment.length);
        }
        if (comment.indexOf('<p>') === 0) {
            comment = comment.substring(3, comment.length);
        }
        if (comment.substr(-1) === '\n') {
            comment = comment.substring(0, comment.length - 1);
        }
        if (comment.substr(-4) === '</p>') {
            comment = comment.substring(0, comment.length - 4);
        }
        return comment;
    };
    JsdocCodeExampleHelper.prototype.getHtmlEntities = function (str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
    JsdocCodeExampleHelper.prototype.helperFunc = function (context, jsdocTags, options) {
        var i = 0;
        var len = jsdocTags.length;
        var tags = [];
        var type = 'html';
        if (options.hash.type) {
            type = options.hash.type;
        }
        for (i; i < len; i++) {
            if (jsdocTags[i].tagName) {
                if (jsdocTags[i].tagName.text === 'example') {
                    var tag = {};
                    if (jsdocTags[i].comment) {
                        if (jsdocTags[i].comment.indexOf('<caption>') !== -1) {
                            tag.comment = jsdocTags[i].comment.replace(/<caption>/g, '<b><i>').replace(/\/caption>/g, '/b></i>');
                        }
                        else {
                            tag.comment = "<pre class=\"line-numbers\"><code class=\"language-" + type + "\">" +
                                this.getHtmlEntities(this.cleanTag(jsdocTags[i].comment)) + "</code></pre>";
                        }
                    }
                    tags.push(tag);
                }
            }
        }
        if (tags.length > 0) {
            context.tags = tags;
            return options.fn(context);
        }
    };
    return JsdocCodeExampleHelper;
}());
exports.JsdocCodeExampleHelper = JsdocCodeExampleHelper;
//# sourceMappingURL=jsdoc-code-example.helper.js.map