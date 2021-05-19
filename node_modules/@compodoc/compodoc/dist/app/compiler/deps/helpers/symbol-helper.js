"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var _ = require("lodash");
var ts_printer_util_1 = require("../../../../utils/ts-printer.util");
var SymbolHelper = /** @class */ (function () {
    function SymbolHelper() {
        this.unknown = '???';
    }
    SymbolHelper.prototype.parseDeepIndentifier = function (name) {
        var nsModule = name.split('.');
        var type = this.getType(name);
        if (nsModule.length > 1) {
            return {
                ns: nsModule[0],
                name: name,
                type: type
            };
        }
        return {
            name: name,
            type: type
        };
    };
    SymbolHelper.prototype.getType = function (name) {
        var type;
        if (name.toLowerCase().indexOf('component') !== -1) {
            type = 'component';
        }
        else if (name.toLowerCase().indexOf('pipe') !== -1) {
            type = 'pipe';
        }
        else if (name.toLowerCase().indexOf('module') !== -1) {
            type = 'module';
        }
        else if (name.toLowerCase().indexOf('directive') !== -1) {
            type = 'directive';
        }
        return type;
    };
    /**
     * Output
     * RouterModule.forRoot 179
     */
    SymbolHelper.prototype.buildIdentifierName = function (node, name) {
        if (ts.isIdentifier(node) && !ts.isPropertyAccessExpression(node)) {
            return node.text + "." + name;
        }
        name = name ? "." + name : '';
        var nodeName = this.unknown;
        if (node.name) {
            nodeName = node.name.text;
        }
        else if (node.text) {
            nodeName = node.text;
        }
        else if (node.expression) {
            if (node.expression.text) {
                nodeName = node.expression.text;
            }
            else if (node.expression.elements) {
                if (ts.isArrayLiteralExpression(node.expression)) {
                    nodeName = node.expression.elements.map(function (el) { return el.text; }).join(', ');
                    nodeName = "[" + nodeName + "]";
                }
            }
        }
        if (ts.isSpreadElement(node)) {
            return "..." + nodeName;
        }
        return "" + this.buildIdentifierName(node.expression, nodeName) + name;
    };
    /**
     * parse expressions such as:
     * { provide: APP_BASE_HREF, useValue: '/' }
     * { provide: 'Date', useFactory: (d1, d2) => new Date(), deps: ['d1', 'd2'] }
     */
    SymbolHelper.prototype.parseProviderConfiguration = function (node) {
        if (node.kind && node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            // Search for provide: HTTP_INTERCEPTORS
            // and if true, return type: 'interceptor' + name
            var interceptorName_1, hasInterceptor_1;
            if (node.properties) {
                if (node.properties.length > 0) {
                    _.forEach(node.properties, function (property) {
                        if (property.kind && property.kind === ts.SyntaxKind.PropertyAssignment) {
                            if (property.name.text === 'provide') {
                                if (property.initializer.text === 'HTTP_INTERCEPTORS') {
                                    hasInterceptor_1 = true;
                                }
                            }
                            if (property.name.text === 'useClass') {
                                interceptorName_1 = property.initializer.text;
                            }
                        }
                    });
                }
            }
            if (hasInterceptor_1) {
                return interceptorName_1;
            }
            else {
                return new ts_printer_util_1.TsPrinterUtil().print(node);
            }
        }
        else {
            return new ts_printer_util_1.TsPrinterUtil().print(node);
        }
    };
    /**
     * Kind
     *  181 CallExpression => "RouterModule.forRoot(args)"
     *   71 Identifier     => "RouterModule" "TodoStore"
     *    9 StringLiteral  => "./app.component.css" "./tab.scss"
     */
    SymbolHelper.prototype.parseSymbolElements = function (node) {
        // parse expressions such as: AngularFireModule.initializeApp(firebaseConfig)
        if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
            var className = this.buildIdentifierName(node.expression);
            // function arguments could be really complex. There are so
            // many use cases that we can't handle. Just print "args" to indicate
            // that we have arguments.
            var functionArgs = node.arguments.length > 0 ? 'args' : '';
            var text = className + "(" + functionArgs + ")";
            return text;
        }
        else if (ts.isPropertyAccessExpression(node)) {
            return this.buildIdentifierName(node);
        }
        else if (ts.isSpreadElement(node)) {
            // Resolve MYARRAY in imports or local file variables after full scan, just return the name of the variable
            if (node.expression && node.expression.text) {
                return node.expression.text;
            }
        }
        return node.text ? node.text : this.parseProviderConfiguration(node);
    };
    /**
     * Kind
     *  177 ArrayLiteralExpression
     *  122 BooleanKeyword
     *    9 StringLiteral
     */
    SymbolHelper.prototype.parseSymbols = function (node) {
        var _this = this;
        if (ts.isStringLiteral(node.initializer)) {
            return [node.initializer.text];
        }
        else if (node.initializer.kind && (node.initializer.kind === ts.SyntaxKind.TrueKeyword || node.initializer.kind === ts.SyntaxKind.FalseKeyword)) {
            return [(node.initializer.kind === ts.SyntaxKind.TrueKeyword) ? 'true' : 'false'];
        }
        else if (ts.isPropertyAccessExpression(node.initializer)) {
            var identifier = this.parseSymbolElements(node.initializer);
            return [
                identifier
            ];
        }
        else if (ts.isArrayLiteralExpression(node.initializer)) {
            return node.initializer.elements.map(function (x) { return _this.parseSymbolElements(x); });
        }
    };
    SymbolHelper.prototype.getSymbolDeps = function (props, type, multiLine) {
        var _this = this;
        if (props.length === 0) {
            return [];
        }
        var deps = props.filter(function (node) {
            return node.name.text === type;
        });
        return deps.map(function (x) { return _this.parseSymbols(x); }).pop() || [];
    };
    SymbolHelper.prototype.getSymbolDepsRaw = function (props, type, multiLine) {
        return props.filter(function (node) { return node.name.text === type; });
    };
    return SymbolHelper;
}());
exports.SymbolHelper = SymbolHelper;
//# sourceMappingURL=symbol-helper.js.map