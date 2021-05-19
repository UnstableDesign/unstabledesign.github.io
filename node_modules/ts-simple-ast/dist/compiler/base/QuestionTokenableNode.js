"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors = require("../../errors");
var manipulation_1 = require("../../manipulation");
var typescript_1 = require("../../typescript");
var utils_1 = require("../../utils");
var callBaseFill_1 = require("../callBaseFill");
function QuestionTokenableNode(Base) {
    return /** @class */ (function (_super) {
        tslib_1.__extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.hasQuestionToken = function () {
            return this.compilerNode.questionToken != null;
        };
        class_1.prototype.getQuestionTokenNode = function () {
            return this.getNodeFromCompilerNodeIfExists(this.compilerNode.questionToken);
        };
        class_1.prototype.getQuestionTokenNodeOrThrow = function () {
            return errors.throwIfNullOrUndefined(this.getQuestionTokenNode(), "Expected to find a question token.");
        };
        class_1.prototype.setHasQuestionToken = function (value) {
            var questionTokenNode = this.getQuestionTokenNode();
            var hasQuestionToken = questionTokenNode != null;
            if (value === hasQuestionToken)
                return this;
            if (value) {
                if (utils_1.TypeGuards.isExclamationTokenableNode(this))
                    this.setHasExclamationToken(false);
                var colonNode = this.getFirstChildByKindOrThrow(typescript_1.SyntaxKind.ColonToken);
                manipulation_1.insertIntoParentTextRange({
                    insertPos: colonNode.getStart(),
                    parent: this,
                    newText: "?"
                });
            }
            else
                manipulation_1.removeChildren({ children: [questionTokenNode] });
            return this;
        };
        class_1.prototype.fill = function (structure) {
            callBaseFill_1.callBaseFill(Base.prototype, this, structure);
            if (structure.hasQuestionToken != null)
                this.setHasQuestionToken(structure.hasQuestionToken);
            return this;
        };
        return class_1;
    }(Base));
}
exports.QuestionTokenableNode = QuestionTokenableNode;
