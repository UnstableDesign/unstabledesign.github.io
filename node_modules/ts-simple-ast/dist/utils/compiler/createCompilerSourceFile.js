"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = require("../../typescript");
function createCompilerSourceFile(filePath, text, scriptTarget) {
    return typescript_1.ts.createSourceFile(filePath, text, scriptTarget == null ? typescript_1.ScriptTarget.Latest : scriptTarget, true);
}
exports.createCompilerSourceFile = createCompilerSourceFile;
