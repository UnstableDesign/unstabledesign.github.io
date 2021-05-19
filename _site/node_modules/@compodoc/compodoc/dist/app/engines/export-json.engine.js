"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var logger_1 = require("../../logger");
var file_engine_1 = require("./file.engine");
var traverse = require('traverse');
var ExportJsonEngine = /** @class */ (function () {
    function ExportJsonEngine(configuration, dependenciesEngine, fileEngine) {
        if (fileEngine === void 0) { fileEngine = new file_engine_1.FileEngine(); }
        this.configuration = configuration;
        this.dependenciesEngine = dependenciesEngine;
        this.fileEngine = fileEngine;
    }
    ExportJsonEngine.prototype.export = function (outputFolder, data) {
        var exportData = {};
        traverse(data).forEach(function (node) {
            if (node) {
                if (node.parent)
                    delete node.parent;
                if (node.initializer)
                    delete node.initializer;
            }
        });
        exportData.pipes = data.pipes;
        exportData.interfaces = data.interfaces;
        exportData.injectables = data.injectables;
        exportData.classes = data.classes;
        exportData.directives = data.directives;
        exportData.components = data.components;
        exportData.modules = this.processModules();
        exportData.miscellaneous = data.miscellaneous;
        exportData.routes = data.routes;
        exportData.coverage = data.coverageData;
        return this.fileEngine
            .write(outputFolder + path.sep + '/documentation.json', JSON.stringify(exportData, null, 4))
            .catch(function (err) {
            logger_1.logger.error('Error during export file generation ', err);
            return Promise.reject(err);
        });
    };
    ExportJsonEngine.prototype.processModules = function () {
        var modules = this.dependenciesEngine.getModules();
        var _resultedModules = [];
        for (var moduleNr = 0; moduleNr < modules.length; moduleNr++) {
            var moduleElement = {
                name: modules[moduleNr].name,
                children: [
                    {
                        type: 'providers',
                        elements: []
                    },
                    {
                        type: 'declarations',
                        elements: []
                    },
                    {
                        type: 'imports',
                        elements: []
                    },
                    {
                        type: 'exports',
                        elements: []
                    },
                    {
                        type: 'bootstrap',
                        elements: []
                    },
                    {
                        type: 'classes',
                        elements: []
                    }
                ]
            };
            for (var k = 0; k < modules[moduleNr].providers.length; k++) {
                var providerElement = {
                    name: modules[moduleNr].providers[k].name
                };
                moduleElement.children[0].elements.push(providerElement);
            }
            for (var k = 0; k < modules[moduleNr].declarations.length; k++) {
                var declarationElement = {
                    name: modules[moduleNr].declarations[k].name
                };
                moduleElement.children[1].elements.push(declarationElement);
            }
            for (var k = 0; k < modules[moduleNr].imports.length; k++) {
                var importElement = {
                    name: modules[moduleNr].imports[k].name
                };
                moduleElement.children[2].elements.push(importElement);
            }
            for (var k = 0; k < modules[moduleNr].exports.length; k++) {
                var exportElement = {
                    name: modules[moduleNr].exports[k].name
                };
                moduleElement.children[3].elements.push(exportElement);
            }
            for (var k = 0; k < modules[moduleNr].bootstrap.length; k++) {
                var bootstrapElement = {
                    name: modules[moduleNr].bootstrap[k].name
                };
                moduleElement.children[4].elements.push(bootstrapElement);
            }
            _resultedModules.push(moduleElement);
        }
        return _resultedModules;
    };
    return ExportJsonEngine;
}());
exports.ExportJsonEngine = ExportJsonEngine;
//# sourceMappingURL=export-json.engine.js.map