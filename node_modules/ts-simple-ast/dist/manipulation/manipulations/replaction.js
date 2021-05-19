"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../utils");
var nodeHandlers_1 = require("../nodeHandlers");
var textManipulators_1 = require("../textManipulators");
var doManipulation_1 = require("./doManipulation");
/**
 * Replaces text in a source file. Will forget any changed nodes.
 */
function replaceNodeText(opts) {
    doManipulation_1.doManipulation(opts.sourceFile, new textManipulators_1.InsertionTextManipulator({
        insertPos: opts.start,
        newText: opts.newText,
        replacingLength: opts.replacingLength
    }), new nodeHandlers_1.NodeHandlerFactory().getForForgetChanged(opts.sourceFile.global.compilerFactory));
}
exports.replaceNodeText = replaceNodeText;
/**
 * Replaces the text in a source file and assumes only the nodes will shift (no tree structure should change).
 *
 * This is very useful when making formatting changes that won't change the AST structure.
 */
function replaceSourceFileTextForFormatting(opts) {
    var sourceFile = opts.sourceFile, newText = opts.newText;
    doManipulation_1.doManipulation(sourceFile, new textManipulators_1.FullReplacementTextManipulator(newText), new nodeHandlers_1.NodeHandlerFactory().getForStraightReplacement(sourceFile.global.compilerFactory));
}
exports.replaceSourceFileTextForFormatting = replaceSourceFileTextForFormatting;
/**
 * Replaces the text in a source file based on rename locations.
 */
function replaceSourceFileTextForRename(opts) {
    var sourceFile = opts.sourceFile, renameLocations = opts.renameLocations, newName = opts.newName;
    var nodeHandlerFactory = new nodeHandlers_1.NodeHandlerFactory();
    doManipulation_1.doManipulation(sourceFile, new textManipulators_1.RenameLocationTextManipulator(renameLocations, newName), nodeHandlerFactory.getForTryOrForget(nodeHandlerFactory.getForForgetChanged(sourceFile.global.compilerFactory)));
}
exports.replaceSourceFileTextForRename = replaceSourceFileTextForRename;
/**
 * Replaces a node text while possibly creating new child nodes.
 */
function replaceTextPossiblyCreatingChildNodes(opts) {
    var replacePos = opts.replacePos, replacingLength = opts.replacingLength, newText = opts.newText, parent = opts.parent;
    doManipulation_1.doManipulation(parent.sourceFile, new textManipulators_1.InsertionTextManipulator({
        insertPos: replacePos,
        replacingLength: replacingLength,
        newText: newText
    }), new nodeHandlers_1.NodeHandlerFactory().getForRange({
        parent: parent,
        start: replacePos,
        end: replacePos + newText.length
    }));
}
exports.replaceTextPossiblyCreatingChildNodes = replaceTextPossiblyCreatingChildNodes;
/**
 * Replaces a source file for a file path move.
 */
function replaceSourceFileForFilePathMove(opts) {
    var sourceFile = opts.sourceFile, newFilePath = opts.newFilePath;
    var replacementSourceFile = utils_1.createCompilerSourceFile(newFilePath, sourceFile.getFullText(), sourceFile.getLanguageVersion());
    new nodeHandlers_1.NodeHandlerFactory().getForStraightReplacement(sourceFile.global.compilerFactory)
        .handleNode(sourceFile, replacementSourceFile, replacementSourceFile);
}
exports.replaceSourceFileForFilePathMove = replaceSourceFileForFilePathMove;
