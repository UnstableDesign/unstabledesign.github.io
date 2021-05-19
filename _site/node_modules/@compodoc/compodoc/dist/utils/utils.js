"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs-extra");
var ts = require("typescript");
var _ = require("lodash");
var link_parser_1 = require("./link-parser");
var angular_lifecycles_hooks_1 = require("./angular-lifecycles-hooks");
var getCurrentDirectory = ts.sys.getCurrentDirectory;
var useCaseSensitiveFileNames = ts.sys.useCaseSensitiveFileNames;
var newLine = ts.sys.newLine;
var marked = require('8fold-marked');
function getNewLine() {
    return newLine;
}
exports.getNewLine = getNewLine;
function getCanonicalFileName(fileName) {
    return useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
}
exports.getCanonicalFileName = getCanonicalFileName;
exports.formatDiagnosticsHost = {
    getCurrentDirectory: getCurrentDirectory,
    getCanonicalFileName: getCanonicalFileName,
    getNewLine: getNewLine
};
function markedtags(tags) {
    var mtags = tags;
    _.forEach(mtags, function (tag) {
        tag.comment = marked(link_parser_1.LinkParser.resolveLinks(tag.comment));
    });
    return mtags;
}
exports.markedtags = markedtags;
function mergeTagsAndArgs(args, jsdoctags) {
    var margs = _.cloneDeep(args);
    _.forEach(margs, function (arg) {
        arg.tagName = {
            text: 'param'
        };
        if (jsdoctags) {
            _.forEach(jsdoctags, function (jsdoctag) {
                if (jsdoctag.name && jsdoctag.name.text === arg.name) {
                    arg.tagName = jsdoctag.tagName;
                    arg.name = jsdoctag.name;
                    arg.comment = jsdoctag.comment;
                    arg.typeExpression = jsdoctag.typeExpression;
                }
            });
        }
    });
    // Add example & returns
    if (jsdoctags) {
        _.forEach(jsdoctags, function (jsdoctag) {
            if (jsdoctag.tagName && jsdoctag.tagName.text === 'example') {
                margs.push({
                    tagName: jsdoctag.tagName,
                    comment: jsdoctag.comment
                });
            }
            if (jsdoctag.tagName && jsdoctag.tagName.text === 'returns') {
                margs.push({
                    tagName: jsdoctag.tagName,
                    comment: jsdoctag.comment
                });
            }
        });
    }
    return margs;
}
exports.mergeTagsAndArgs = mergeTagsAndArgs;
function readConfig(configFile) {
    var result = ts.readConfigFile(configFile, ts.sys.readFile);
    if (result.error) {
        var message = ts.formatDiagnostics([result.error], exports.formatDiagnosticsHost);
        throw new Error(message);
    }
    return result.config;
}
exports.readConfig = readConfig;
function stripBom(source) {
    if (source.charCodeAt(0) === 0xFEFF) {
        return source.slice(1);
    }
    return source;
}
exports.stripBom = stripBom;
function hasBom(source) {
    return (source.charCodeAt(0) === 0xFEFF);
}
exports.hasBom = hasBom;
function handlePath(files, cwd) {
    var _files = files;
    var i = 0;
    var len = files.length;
    for (i; i < len; i++) {
        if (files[i].indexOf(cwd) === -1) {
            files[i] = path.resolve(cwd + path.sep + files[i]);
        }
    }
    return _files;
}
exports.handlePath = handlePath;
function cleanLifecycleHooksFromMethods(methods) {
    var result = [];
    var i = 0;
    var len = methods.length;
    for (i; i < len; i++) {
        if (!(methods[i].name in angular_lifecycles_hooks_1.AngularLifecycleHooks)) {
            result.push(methods[i]);
        }
    }
    return result;
}
exports.cleanLifecycleHooksFromMethods = cleanLifecycleHooksFromMethods;
function cleanSourcesForWatch(list) {
    return list.filter(function (element) {
        if (fs.existsSync(process.cwd() + path.sep + element)) {
            return element;
        }
    });
}
exports.cleanSourcesForWatch = cleanSourcesForWatch;
function getNamesCompareFn(name) {
    /**
     * Copyright https://github.com/ng-bootstrap/ng-bootstrap
     */
    name = name || 'name';
    var t = function (a, b) {
        if (a[name]) {
            return a[name].localeCompare(b[name]);
        }
        else {
            return 0;
        }
    };
    return t;
}
exports.getNamesCompareFn = getNamesCompareFn;
//# sourceMappingURL=utils.js.map