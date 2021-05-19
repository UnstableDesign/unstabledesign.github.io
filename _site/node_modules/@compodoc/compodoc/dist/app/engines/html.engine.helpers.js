"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Handlebars = require("handlebars");
var _ = require("lodash");
var compare_helper_1 = require("./html-engine-helpers/compare.helper");
var or_helper_1 = require("./html-engine-helpers/or.helper");
var function_signature_helper_1 = require("./html-engine-helpers/function-signature.helper");
var is_not_toggle_helper_1 = require("./html-engine-helpers/is-not-toggle.helper");
var if_string_helper_1 = require("./html-engine-helpers/if-string.helper");
var or_length_helper_1 = require("./html-engine-helpers/or-length.helper");
var filter_angular2_modules_helper_1 = require("./html-engine-helpers/filter-angular2-modules.helper");
var debug_helper_1 = require("./html-engine-helpers/debug.helper");
var break_lines_helper_1 = require("./html-engine-helpers/break-lines.helper");
var clean_paragraph_helper_1 = require("./html-engine-helpers/clean-paragraph.helper");
var escape_simple_quote_helper_1 = require("./html-engine-helpers/escape-simple-quote.helper");
var break_comma_helper_1 = require("./html-engine-helpers/break-comma.helper");
var modif_kind_helper_1 = require("./html-engine-helpers/modif-kind-helper");
var modif_icon_helper_1 = require("./html-engine-helpers/modif-icon.helper");
var relative_url_helper_1 = require("./html-engine-helpers/relative-url.helper");
var jsdoc_returns_comment_helper_1 = require("./html-engine-helpers/jsdoc-returns-comment.helper");
var jsdoc_code_example_helper_1 = require("./html-engine-helpers/jsdoc-code-example.helper");
var jsdoc_example_helper_1 = require("./html-engine-helpers/jsdoc-example.helper");
var jsdoc_params_helper_1 = require("./html-engine-helpers/jsdoc-params.helper");
var jsdoc_params_valid_helper_1 = require("./html-engine-helpers/jsdoc-params-valid.helper");
var jsdoc_default_helper_1 = require("./html-engine-helpers/jsdoc-default.helper");
var link_type_helper_1 = require("./html-engine-helpers/link-type.helper");
var indexable_signature_helper_1 = require("./html-engine-helpers/indexable-signature.helper");
var object_helper_1 = require("./html-engine-helpers/object.helper");
var parse_description_helper_1 = require("./html-engine-helpers/parse-description.helper");
var HtmlEngineHelpers = /** @class */ (function () {
    function HtmlEngineHelpers() {
    }
    HtmlEngineHelpers.prototype.registerHelpers = function (bars, configuration, dependenciesEngine) {
        this.registerHelper(bars, 'compare', new compare_helper_1.CompareHelper());
        this.registerHelper(bars, 'or', new or_helper_1.OrHelper());
        this.registerHelper(bars, 'functionSignature', new function_signature_helper_1.FunctionSignatureHelper(configuration, dependenciesEngine));
        this.registerHelper(bars, 'isNotToggle', new is_not_toggle_helper_1.IsNotToggleHelper(configuration));
        this.registerHelper(bars, 'ifString', new if_string_helper_1.IfStringHelper());
        this.registerHelper(bars, 'orLength', new or_length_helper_1.OrLengthHelper());
        this.registerHelper(bars, 'filterAngular2Modules', new filter_angular2_modules_helper_1.FilterAngular2ModulesHelper());
        this.registerHelper(bars, 'debug', new debug_helper_1.DebugHelper());
        this.registerHelper(bars, 'breaklines', new break_lines_helper_1.BreakLinesHelper(bars));
        this.registerHelper(bars, 'clean-paragraph', new clean_paragraph_helper_1.CleanParagraphHelper());
        this.registerHelper(bars, 'escapeSimpleQuote', new escape_simple_quote_helper_1.EscapeSimpleQuoteHelper());
        this.registerHelper(bars, 'breakComma', new break_comma_helper_1.BreakCommaHelper(bars));
        this.registerHelper(bars, 'modifKind', new modif_kind_helper_1.ModifKindHelper());
        this.registerHelper(bars, 'modifIcon', new modif_icon_helper_1.ModifIconHelper());
        this.registerHelper(bars, 'relativeURL', new relative_url_helper_1.RelativeURLHelper());
        this.registerHelper(bars, 'jsdoc-returns-comment', new jsdoc_returns_comment_helper_1.JsdocReturnsCommentHelper());
        this.registerHelper(bars, 'jsdoc-code-example', new jsdoc_code_example_helper_1.JsdocCodeExampleHelper());
        this.registerHelper(bars, 'jsdoc-example', new jsdoc_example_helper_1.JsdocExampleHelper());
        this.registerHelper(bars, 'jsdoc-params', new jsdoc_params_helper_1.JsdocParamsHelper());
        this.registerHelper(bars, 'jsdoc-params-valid', new jsdoc_params_valid_helper_1.JsdocParamsValidHelper());
        this.registerHelper(bars, 'jsdoc-default', new jsdoc_default_helper_1.JsdocDefaultHelper());
        this.registerHelper(bars, 'linkType', new link_type_helper_1.LinkTypeHelper(configuration, dependenciesEngine));
        this.registerHelper(bars, 'indexableSignature', new indexable_signature_helper_1.IndexableSignatureHelper());
        this.registerHelper(bars, 'object', new object_helper_1.ObjectHelper());
        this.registerHelper(bars, 'parseDescription', new parse_description_helper_1.ParseDescriptionHelper(dependenciesEngine));
    };
    HtmlEngineHelpers.prototype.registerHelper = function (bars, key, helper) {
        Handlebars.registerHelper(key, function () {
            // tslint:disable-next-line:no-invalid-this
            return helper.helperFunc.apply(helper, [this].concat(_.slice(arguments)));
        });
    };
    return HtmlEngineHelpers;
}());
exports.HtmlEngineHelpers = HtmlEngineHelpers;
//# sourceMappingURL=html.engine.helpers.js.map