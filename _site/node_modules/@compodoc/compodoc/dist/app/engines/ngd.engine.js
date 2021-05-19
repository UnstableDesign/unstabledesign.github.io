"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_engine_1 = require("./file.engine");
var ngdT = require('@compodoc/ngd-transformer');
var NgdEngine = /** @class */ (function () {
    function NgdEngine(dependenciesEngine, fileEngine) {
        if (fileEngine === void 0) { fileEngine = new file_engine_1.FileEngine(); }
        this.dependenciesEngine = dependenciesEngine;
        this.fileEngine = fileEngine;
    }
    NgdEngine.prototype.init = function (outputpath) {
        this.engine = new ngdT.DotEngine({
            output: outputpath,
            displayLegend: true,
            outputFormats: 'svg',
            silent: false
        });
    };
    NgdEngine.prototype.renderGraph = function (filepath, outputpath, type, name) {
        this.engine.updateOutput(outputpath);
        if (type === 'f') {
            return this.engine.generateGraph([this.dependenciesEngine.getRawModule(name)]);
        }
        else {
            return this.engine.generateGraph(this.dependenciesEngine.rawModulesForOverview);
        }
    };
    NgdEngine.prototype.readGraph = function (filepath, name) {
        return this.fileEngine
            .get(filepath)
            .catch(function (err) { return Promise.reject('Error during graph read ' + name); });
    };
    return NgdEngine;
}());
exports.NgdEngine = NgdEngine;
//# sourceMappingURL=ngd.engine.js.map