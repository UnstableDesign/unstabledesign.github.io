"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors = require("../../errors");
var utils_1 = require("../../utils");
function doManipulation(sourceFile, textManipulator, nodeHandler) {
    var newFileText = textManipulator.getNewText(sourceFile.getFullText());
    try {
        var replacementSourceFile = utils_1.createCompilerSourceFile(sourceFile.getFilePath(), newFileText, sourceFile.getLanguageVersion());
        nodeHandler.handleNode(sourceFile, replacementSourceFile, replacementSourceFile);
    }
    catch (err) {
        throw new errors.InvalidOperationError(err.message + "\n" +
            "-- Details --\n" +
            ("Path: " + sourceFile.getFilePath() + "\n") +
            ("Text: " + JSON.stringify(textManipulator.getTextForError(newFileText))));
    }
}
exports.doManipulation = doManipulation;
