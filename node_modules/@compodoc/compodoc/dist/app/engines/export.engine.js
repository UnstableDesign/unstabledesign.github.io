"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_engine_1 = require("./file.engine");
var export_json_engine_1 = require("./export-json.engine");
var traverse = require('traverse');
var ExportEngine = /** @class */ (function () {
    function ExportEngine(configuration, dependenciesEngine, fileEngine) {
        if (fileEngine === void 0) { fileEngine = new file_engine_1.FileEngine(); }
        this.configuration = configuration;
        this.dependenciesEngine = dependenciesEngine;
        this.fileEngine = fileEngine;
    }
    ExportEngine.prototype.export = function (outputFolder, data) {
        switch (this.configuration.mainData.exportFormat) {
            case 'json':
                this._engine = new export_json_engine_1.ExportJsonEngine(this.configuration, this.dependenciesEngine, this.fileEngine);
                return this._engine.export(outputFolder, data);
        }
    };
    return ExportEngine;
}());
exports.ExportEngine = ExportEngine;
//# sourceMappingURL=export.engine.js.map