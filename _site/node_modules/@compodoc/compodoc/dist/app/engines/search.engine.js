"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var Handlebars = require("handlebars");
var logger_1 = require("../../logger");
var file_engine_1 = require("./file.engine");
var lunr = require('lunr');
var cheerio = require('cheerio');
var Entities = require('html-entities').AllHtmlEntities;
var Html = new Entities();
var SearchEngine = /** @class */ (function () {
    function SearchEngine(configuration, fileEngine) {
        if (fileEngine === void 0) { fileEngine = new file_engine_1.FileEngine(); }
        this.configuration = configuration;
        this.fileEngine = fileEngine;
        this.documentsStore = {};
    }
    SearchEngine.prototype.getSearchIndex = function () {
        if (!this.searchIndex) {
            this.searchIndex = lunr(function () {
                this.ref('url');
                this.field('title', { boost: 10 });
                this.field('body');
            });
        }
        return this.searchIndex;
    };
    SearchEngine.prototype.indexPage = function (page) {
        var text;
        var $ = cheerio.load(page.rawData);
        text = $('.content').html();
        text = Html.decode(text);
        text = text.replace(/(<([^>]+)>)/ig, '');
        page.url = page.url.replace(this.configuration.mainData.output, '');
        var doc = {
            url: page.url,
            title: page.infos.context + ' - ' + page.infos.name,
            body: text
        };
        if (!this.documentsStore.hasOwnProperty(doc.url)) {
            this.documentsStore[doc.url] = doc;
            this.getSearchIndex().add(doc);
        }
    };
    SearchEngine.prototype.generateSearchIndexJson = function (outputFolder) {
        var _this = this;
        return this.fileEngine.get(__dirname + '/../src/templates/partials/search-index.hbs').then(function (data) {
            var template = Handlebars.compile(data);
            var result = template({
                index: JSON.stringify(_this.getSearchIndex()),
                store: JSON.stringify(_this.documentsStore)
            });
            var testOutputDir = outputFolder.match(process.cwd());
            if (!testOutputDir) {
                outputFolder = outputFolder.replace(process.cwd(), '');
            }
            return _this.fileEngine.write(outputFolder + path.sep + '/js/search/search_index.js', result)
                .catch(function (err) {
                logger_1.logger.error('Error during search index file generation ', err);
                return Promise.reject(err);
            });
        }, function (err) { return Promise.reject('Error during search index generation'); });
    };
    return SearchEngine;
}());
exports.SearchEngine = SearchEngine;
//# sourceMappingURL=search.engine.js.map