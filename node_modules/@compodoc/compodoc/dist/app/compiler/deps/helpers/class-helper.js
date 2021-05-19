"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../../utils/utils");
var kind_to_type_1 = require("../../../../utils/kind-to-type");
var _ = require("lodash");
var ts = require("typescript");
var jsdoc_parser_util_1 = require("../../../../utils/jsdoc-parser.util");
var imports_util_1 = require("../../../../utils/imports.util");
var marked = require('8fold-marked');
var ClassHelper = /** @class */ (function () {
    function ClassHelper(typeChecker, configuration) {
        this.typeChecker = typeChecker;
        this.configuration = configuration;
        this.jsdocParserUtil = new jsdoc_parser_util_1.JsdocParserUtil();
        this.importsUtil = new imports_util_1.ImportsUtil();
    }
    ClassHelper.prototype.stringifyDefaultValue = function (node) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        if (node.getText()) {
            return node.getText();
        }
        else if (node.kind === ts.SyntaxKind.FalseKeyword) {
            return 'false';
        }
        else if (node.kind === ts.SyntaxKind.TrueKeyword) {
            return 'true';
        }
    };
    ClassHelper.prototype.visitTypeName = function (typeName) {
        if (typeName.text) {
            return typeName.text;
        }
        return this.visitTypeName(typeName.left) + "." + this.visitTypeName(typeName.right);
    };
    ClassHelper.prototype.visitType = function (node) {
        var _return = 'void';
        if (!node) {
            return _return;
        }
        if (node) {
            _return = this.visitTypeName(node.typeName);
        }
        else if (node.type) {
            if (node.type.kind) {
                _return = kind_to_type_1.kindToType(node.type.kind);
            }
            if (node.type.typeName) {
                _return = this.visitTypeName(node.type.typeName);
            }
            if (node.type.typeArguments) {
                _return += '<';
                var typeArguments = [];
                for (var _i = 0, _a = node.type.typeArguments; _i < _a.length; _i++) {
                    var argument = _a[_i];
                    typeArguments.push(this.visitType(argument));
                }
                _return += typeArguments.join(' | ');
                _return += '>';
            }
            if (node.type.elementType) {
                var _firstPart = this.visitType(node.type.elementType);
                _return = _firstPart + kind_to_type_1.kindToType(node.type.kind);
            }
            if (node.type.types && ts.isUnionTypeNode(node.type)) {
                _return = '';
                var i = 0;
                var len = node.type.types.length;
                for (i; i < len; i++) {
                    var type = node.type.types[i];
                    _return += kind_to_type_1.kindToType(type.kind);
                    if (ts.isLiteralTypeNode(type) && type.literal) {
                        _return += '"' + type.literal.text + '"';
                    }
                    if (type.typeName) {
                        _return += this.visitTypeName(type.typeName);
                    }
                    if (i < len - 1) {
                        _return += ' | ';
                    }
                }
            }
        }
        else if (node.elementType) {
            _return = kind_to_type_1.kindToType(node.elementType.kind) + kind_to_type_1.kindToType(node.kind);
        }
        else if (node.types && ts.isUnionTypeNode(node)) {
            _return = '';
            var i = 0;
            var len = node.types.length;
            for (i; i < len; i++) {
                var type = node.types[i];
                _return += kind_to_type_1.kindToType(type.kind);
                if (ts.isLiteralTypeNode(type) && type.literal) {
                    _return += '"' + type.literal.text + '"';
                }
                if (type.typeName) {
                    _return += this.visitTypeName(type.typeName);
                }
                if (i < len - 1) {
                    _return += ' | ';
                }
            }
        }
        else if (node.dotDotDotToken) {
            _return = 'any[]';
        }
        else {
            _return = kind_to_type_1.kindToType(node.kind);
        }
        if (node.typeArguments && node.typeArguments.length > 0) {
            _return += '<';
            for (var _b = 0, _c = node.typeArguments; _b < _c.length; _b++) {
                var argument = _c[_b];
                _return += this.visitType(argument);
            }
            _return += '>';
        }
        return _return;
    };
    ClassHelper.prototype.visitClassDeclaration = function (fileName, classDeclaration, sourceFile) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var symbol = this.typeChecker.getSymbolAtLocation(classDeclaration.name);
        var description = '';
        if (symbol) {
            description = marked(ts.displayPartsToString(symbol.getDocumentationComment()));
        }
        var className = classDeclaration.name.text;
        var directiveInfo;
        var members;
        var implementsElements = [];
        var extendsElement;
        var jsdoctags = [];
        if (typeof ts.getClassImplementsHeritageClauseElements !== 'undefined') {
            var implementedTypes = ts.getClassImplementsHeritageClauseElements(classDeclaration);
            if (implementedTypes) {
                var i = 0;
                var len = implementedTypes.length;
                for (i; i < len; i++) {
                    if (implementedTypes[i].expression) {
                        implementsElements.push(implementedTypes[i].expression.text);
                    }
                }
            }
        }
        if (typeof ts.getClassExtendsHeritageClauseElement !== 'undefined') {
            var extendsTypes = ts.getClassExtendsHeritageClauseElement(classDeclaration);
            if (extendsTypes) {
                if (extendsTypes.expression) {
                    extendsElement = extendsTypes.expression.text;
                }
            }
        }
        if (symbol) {
            if (symbol.valueDeclaration) {
                jsdoctags = this.jsdocParserUtil.getJSDocs(symbol.valueDeclaration);
            }
        }
        if (classDeclaration.decorators) {
            for (var i = 0; i < classDeclaration.decorators.length; i++) {
                if (this.isDirectiveDecorator(classDeclaration.decorators[i])) {
                    directiveInfo = this.visitDirectiveDecorator(classDeclaration.decorators[i], sourceFile);
                    members = this.visitMembers(classDeclaration.members, sourceFile);
                    return {
                        description: description,
                        inputs: members.inputs,
                        outputs: members.outputs,
                        hostBindings: members.hostBindings,
                        hostListeners: members.hostListeners,
                        properties: members.properties,
                        methods: members.methods,
                        indexSignatures: members.indexSignatures,
                        kind: members.kind,
                        constructor: members.constructor,
                        jsdoctags: jsdoctags,
                        extends: extendsElement,
                        implements: implementsElements,
                        accessors: members.accessors
                    };
                }
                else if (this.isServiceDecorator(classDeclaration.decorators[i])) {
                    members = this.visitMembers(classDeclaration.members, sourceFile);
                    return [{
                            fileName: fileName,
                            className: className,
                            description: description,
                            methods: members.methods,
                            indexSignatures: members.indexSignatures,
                            properties: members.properties,
                            kind: members.kind,
                            constructor: members.constructor,
                            jsdoctags: jsdoctags,
                            extends: extendsElement,
                            implements: implementsElements,
                            accessors: members.accessors
                        }];
                }
                else if (this.isPipeDecorator(classDeclaration.decorators[i])) {
                    members = this.visitMembers(classDeclaration.members, sourceFile);
                    return [{
                            fileName: fileName,
                            className: className,
                            description: description,
                            jsdoctags: jsdoctags,
                            properties: members.properties,
                            methods: members.methods
                        }];
                }
                else if (this.isModuleDecorator(classDeclaration.decorators[i])) {
                    return [{
                            fileName: fileName,
                            className: className,
                            description: description,
                            jsdoctags: jsdoctags
                        }];
                }
                else {
                    members = this.visitMembers(classDeclaration.members, sourceFile);
                    return [{
                            description: description,
                            methods: members.methods,
                            indexSignatures: members.indexSignatures,
                            properties: members.properties,
                            kind: members.kind,
                            constructor: members.constructor,
                            jsdoctags: jsdoctags,
                            extends: extendsElement,
                            implements: implementsElements,
                            accessors: members.accessors
                        }];
                }
            }
        }
        else if (description) {
            members = this.visitMembers(classDeclaration.members, sourceFile);
            return [{
                    description: description,
                    methods: members.methods,
                    indexSignatures: members.indexSignatures,
                    properties: members.properties,
                    kind: members.kind,
                    constructor: members.constructor,
                    jsdoctags: jsdoctags,
                    extends: extendsElement,
                    implements: implementsElements,
                    accessors: members.accessors
                }];
        }
        else {
            members = this.visitMembers(classDeclaration.members, sourceFile);
            return [{
                    methods: members.methods,
                    indexSignatures: members.indexSignatures,
                    properties: members.properties,
                    kind: members.kind,
                    constructor: members.constructor,
                    jsdoctags: jsdoctags,
                    extends: extendsElement,
                    implements: implementsElements,
                    accessors: members.accessors
                }];
        }
        return [];
    };
    ClassHelper.prototype.visitDirectiveDecorator = function (decorator, sourceFile) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var selector;
        var exportAs;
        var properties;
        if (decorator.expression.arguments.length > 0) {
            var firstArgument = decorator.expression.arguments[0], properties_1;
            if (firstArgument.kind && firstArgument.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                properties_1 = decorator.expression.arguments[0].properties;
            }
            var searchInProperties = function () {
                for (var i = 0; i < properties_1.length; i++) {
                    if (properties_1[i].name.text === 'selector') {
                        // TODO: this will only work if selector is initialized as a string literal
                        selector = properties_1[i].initializer.text;
                    }
                    if (properties_1[i].name.text === 'exportAs') {
                        // TODO: this will only work if selector is initialized as a string literal
                        exportAs = properties_1[i].initializer.text;
                    }
                }
            };
            if (properties_1) {
                // if decorator.expression.arguments[0].kind && decorator.expression.arguments[0].kind === ObjectLiteralExpression = 178
                // we have object literal definition of the decorator
                searchInProperties();
            }
            else {
                // if not, may be it is an import
                properties_1 = this.importsUtil.merge(firstArgument.text, sourceFile);
                searchInProperties();
            }
        }
        return {
            selector: selector,
            exportAs: exportAs
        };
    };
    ClassHelper.prototype.isDirectiveDecorator = function (decorator) {
        if (decorator.expression.expression) {
            var decoratorIdentifierText = decorator.expression.expression.text;
            return decoratorIdentifierText === 'Directive' || decoratorIdentifierText === 'Component';
        }
        else {
            return false;
        }
    };
    ClassHelper.prototype.isServiceDecorator = function (decorator) {
        return (decorator.expression.expression) ? decorator.expression.expression.text === 'Injectable' : false;
    };
    ClassHelper.prototype.addAccessor = function (accessors, nodeAccessor, sourceFile) {
        var nodeName = '';
        if (nodeAccessor.name) {
            nodeName = nodeAccessor.name.escapedText;
            var jsdoctags = this.jsdocParserUtil.getJSDocs(nodeAccessor);
            if (!accessors[nodeName]) {
                accessors[nodeName] = {
                    'name': nodeName,
                    'setSignature': undefined,
                    'getSignature': undefined
                };
            }
            if (nodeAccessor.kind === ts.SyntaxKind.SetAccessor) {
                var setSignature = {
                    'name': nodeName,
                    'type': 'void',
                    'args': nodeAccessor.parameters.map(function (param) {
                        return {
                            'name': param.name.escapedText,
                            'type': (param.type) ? kind_to_type_1.kindToType(param.type.kind) : ''
                        };
                    }),
                    returnType: (nodeAccessor.type) ? this.visitType(nodeAccessor.type) : 'void',
                    line: this.getPosition(nodeAccessor, sourceFile).line + 1
                };
                if (nodeAccessor.jsDoc && nodeAccessor.jsDoc.length >= 1) {
                    setSignature.description = marked(nodeAccessor.jsDoc[0].comment);
                }
                if (jsdoctags && jsdoctags.length >= 1) {
                    if (jsdoctags[0].tags) {
                        setSignature.jsdoctags = utils_1.markedtags(jsdoctags[0].tags);
                    }
                }
                if (setSignature.jsdoctags && setSignature.jsdoctags.length > 0) {
                    setSignature.jsdoctags = utils_1.mergeTagsAndArgs(setSignature.args, setSignature.jsdoctags);
                }
                else if (setSignature.args && setSignature.args.length > 0) {
                    setSignature.jsdoctags = utils_1.mergeTagsAndArgs(setSignature.args);
                }
                accessors[nodeName].setSignature = setSignature;
            }
            if (nodeAccessor.kind === ts.SyntaxKind.GetAccessor) {
                var getSignature = {
                    'name': nodeName,
                    'type': (nodeAccessor.type) ? kind_to_type_1.kindToType(nodeAccessor.type.kind) : '',
                    returnType: (nodeAccessor.type) ? this.visitType(nodeAccessor.type) : '',
                    line: this.getPosition(nodeAccessor, sourceFile).line + 1
                };
                if (nodeAccessor.jsDoc && nodeAccessor.jsDoc.length >= 1) {
                    getSignature.description = marked(nodeAccessor.jsDoc[0].comment);
                }
                if (jsdoctags && jsdoctags.length >= 1) {
                    if (jsdoctags[0].tags) {
                        getSignature.jsdoctags = utils_1.markedtags(jsdoctags[0].tags);
                    }
                }
                accessors[nodeName].getSignature = getSignature;
            }
        }
    };
    ClassHelper.prototype.visitMembers = function (members, sourceFile) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var inputs = [];
        var outputs = [];
        var hostBindings = [];
        var hostListeners = [];
        var methods = [];
        var properties = [];
        var indexSignatures = [];
        var kind;
        var inputDecorator;
        var hostBinding;
        var hostListener;
        var constructor;
        var outDecorator;
        var accessors = {};
        var result = {};
        for (var i = 0; i < members.length; i++) {
            // Allows typescript guess type when using ts.is*
            var member = members[i];
            inputDecorator = this.getDecoratorOfType(member, 'Input');
            outDecorator = this.getDecoratorOfType(member, 'Output');
            hostBinding = this.getDecoratorOfType(member, 'HostBinding');
            hostListener = this.getDecoratorOfType(member, 'HostListener');
            kind = member.kind;
            if (inputDecorator) {
                inputs.push(this.visitInputAndHostBinding(member, inputDecorator, sourceFile));
                if (ts.isSetAccessorDeclaration(member)) {
                    this.addAccessor(accessors, members[i], sourceFile);
                }
            }
            else if (outDecorator) {
                outputs.push(this.visitOutput(member, outDecorator, sourceFile));
            }
            else if (hostBinding) {
                hostBindings.push(this.visitInputAndHostBinding(member, hostBinding, sourceFile));
            }
            else if (hostListener) {
                hostListeners.push(this.visitHostListener(member, hostListener, sourceFile));
            }
            else if (!this.isHiddenMember(member)) {
                if (!(this.isPrivate(member) && this.configuration.mainData.disablePrivate)) {
                    if (!(this.isInternal(member) && this.configuration.mainData.disableInternal)) {
                        if (!(this.isProtected(member) && this.configuration.mainData.disableProtected)) {
                            if (ts.isMethodDeclaration(member) || ts.isMethodSignature(member)) {
                                methods.push(this.visitMethodDeclaration(member, sourceFile));
                            }
                            else if (ts.isPropertyDeclaration(member) ||
                                ts.isPropertySignature(member)) {
                                properties.push(this.visitProperty(member, sourceFile));
                            }
                            else if (ts.isCallSignatureDeclaration(member)) {
                                properties.push(this.visitCallDeclaration(member, sourceFile));
                            }
                            else if (ts.isGetAccessorDeclaration(member) || ts.isSetAccessorDeclaration(member)) {
                                this.addAccessor(accessors, members[i], sourceFile);
                            }
                            else if (ts.isIndexSignatureDeclaration(member)) {
                                indexSignatures.push(this.visitIndexDeclaration(member, sourceFile));
                            }
                            else if (ts.isConstructorDeclaration(member)) {
                                var _constructorProperties = this.visitConstructorProperties(member, sourceFile);
                                var j = 0;
                                var len = _constructorProperties.length;
                                for (j; j < len; j++) {
                                    properties.push(_constructorProperties[j]);
                                }
                                constructor = this.visitConstructorDeclaration(member, sourceFile);
                            }
                        }
                    }
                }
            }
        }
        inputs.sort(utils_1.getNamesCompareFn());
        outputs.sort(utils_1.getNamesCompareFn());
        hostBindings.sort(utils_1.getNamesCompareFn());
        hostListeners.sort(utils_1.getNamesCompareFn());
        properties.sort(utils_1.getNamesCompareFn());
        methods.sort(utils_1.getNamesCompareFn());
        indexSignatures.sort(utils_1.getNamesCompareFn());
        result = {
            inputs: inputs,
            outputs: outputs,
            hostBindings: hostBindings,
            hostListeners: hostListeners,
            methods: methods,
            properties: properties,
            indexSignatures: indexSignatures,
            kind: kind,
            constructor: constructor
        };
        if (Object.keys(accessors).length) {
            result['accessors'] = accessors;
        }
        return result;
    };
    ClassHelper.prototype.visitCallDeclaration = function (method, sourceFile) {
        var _this = this;
        var result = {
            id: 'call-declaration-' + Date.now(),
            description: marked(ts.displayPartsToString(method.symbol.getDocumentationComment())),
            args: method.parameters ? method.parameters.map(function (prop) { return _this.visitArgument(prop); }) : [],
            returnType: this.visitType(method.type),
            line: this.getPosition(method, sourceFile).line + 1
        };
        var jsdoctags = this.jsdocParserUtil.getJSDocs(method);
        if (jsdoctags && jsdoctags.length >= 1) {
            if (jsdoctags[0].tags) {
                result.jsdoctags = utils_1.markedtags(jsdoctags[0].tags);
            }
        }
        return result;
    };
    ClassHelper.prototype.visitIndexDeclaration = function (method, sourceFile) {
        var _this = this;
        return {
            id: 'index-declaration-' + Date.now(),
            description: marked(ts.displayPartsToString(method.symbol.getDocumentationComment())),
            args: method.parameters ? method.parameters.map(function (prop) { return _this.visitArgument(prop); }) : [],
            returnType: this.visitType(method.type),
            line: this.getPosition(method, sourceFile).line + 1
        };
    };
    ClassHelper.prototype.isPrivate = function (member) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        if (member.modifiers) {
            var isPrivate = member.modifiers.some(function (modifier) { return modifier.kind === ts.SyntaxKind.PrivateKeyword; });
            if (isPrivate) {
                return true;
            }
        }
        return this.isHiddenMember(member);
    };
    ClassHelper.prototype.isProtected = function (member) {
        if (member.modifiers) {
            var isProtected = member.modifiers.some(function (modifier) { return modifier.kind === ts.SyntaxKind.ProtectedKeyword; });
            if (isProtected) {
                return true;
            }
        }
        return this.isHiddenMember(member);
    };
    ClassHelper.prototype.isInternal = function (member) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var internalTags = ['internal'];
        if (member.jsDoc) {
            for (var _i = 0, _a = member.jsDoc; _i < _a.length; _i++) {
                var doc = _a[_i];
                if (doc.tags) {
                    for (var _b = 0, _c = doc.tags; _b < _c.length; _b++) {
                        var tag = _c[_b];
                        if (internalTags.indexOf(tag.tagName.text) > -1) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };
    ClassHelper.prototype.visitConstructorDeclaration = function (method, sourceFile) {
        var _this = this;
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var result = {
            name: 'constructor',
            description: '',
            args: method.parameters ? method.parameters.map(function (prop) { return _this.visitArgument(prop); }) : [],
            line: this.getPosition(method, sourceFile).line + 1
        };
        var jsdoctags = this.jsdocParserUtil.getJSDocs(method);
        if (method.symbol) {
            result.description = marked(ts.displayPartsToString(method.symbol.getDocumentationComment()));
        }
        if (method.modifiers) {
            if (method.modifiers.length > 0) {
                result.modifierKind = method.modifiers[0].kind;
            }
        }
        if (jsdoctags && jsdoctags.length >= 1) {
            if (jsdoctags[0].tags) {
                result.jsdoctags = utils_1.markedtags(jsdoctags[0].tags);
            }
        }
        if (result.jsdoctags && result.jsdoctags.length > 0) {
            result.jsdoctags = utils_1.mergeTagsAndArgs(result.args, result.jsdoctags);
        }
        else if (result.args.length > 0) {
            result.jsdoctags = utils_1.mergeTagsAndArgs(result.args);
        }
        return result;
    };
    ClassHelper.prototype.getDecoratorOfType = function (node, decoratorType) {
        var decorators = node.decorators || [];
        for (var i = 0; i < decorators.length; i++) {
            if (decorators[i].expression.expression) {
                if (decorators[i].expression.expression.text === decoratorType) {
                    return decorators[i];
                }
            }
        }
        return undefined;
    };
    ClassHelper.prototype.visitProperty = function (property, sourceFile) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var result = {
            name: property.name.text,
            defaultValue: property.initializer ? this.stringifyDefaultValue(property.initializer) : undefined,
            type: this.visitType(property),
            description: '',
            line: this.getPosition(property, sourceFile).line + 1
        };
        var jsdoctags;
        if (property.jsDoc) {
            jsdoctags = this.jsdocParserUtil.getJSDocs(property);
        }
        if (property.symbol) {
            result.description = marked(ts.displayPartsToString(property.symbol.getDocumentationComment()));
        }
        if (property.decorators) {
            result.decorators = this.formatDecorators(property.decorators);
        }
        if (property.modifiers) {
            if (property.modifiers.length > 0) {
                result.modifierKind = property.modifiers[0].kind;
            }
        }
        if (jsdoctags && jsdoctags.length >= 1) {
            if (jsdoctags[0].tags) {
                result.jsdoctags = utils_1.markedtags(jsdoctags[0].tags);
            }
        }
        return result;
    };
    ClassHelper.prototype.visitConstructorProperties = function (constr, sourceFile) {
        var that = this;
        if (constr.parameters) {
            var _parameters = [];
            var i = 0;
            var len = constr.parameters.length;
            for (i; i < len; i++) {
                if (this.isPublic(constr.parameters[i])) {
                    _parameters.push(this.visitProperty(constr.parameters[i], sourceFile));
                }
            }
            return _parameters;
        }
        else {
            return [];
        }
    };
    ClassHelper.prototype.isPublic = function (member) {
        if (member.modifiers) {
            var isPublic = member.modifiers.some(function (modifier) { return modifier.kind === ts.SyntaxKind.PublicKeyword; });
            if (isPublic) {
                return true;
            }
        }
        return this.isHiddenMember(member);
    };
    ClassHelper.prototype.isHiddenMember = function (member) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var internalTags = ['hidden'];
        if (member.jsDoc) {
            for (var _i = 0, _a = member.jsDoc; _i < _a.length; _i++) {
                var doc = _a[_i];
                if (doc.tags) {
                    for (var _b = 0, _c = doc.tags; _b < _c.length; _b++) {
                        var tag = _c[_b];
                        if (internalTags.indexOf(tag.tagName.text) > -1) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };
    ClassHelper.prototype.visitInputAndHostBinding = function (property, inDecorator, sourceFile) {
        var inArgs = inDecorator.expression.arguments;
        var _return = {};
        _return.name = (inArgs.length > 0) ? inArgs[0].text : property.name.text;
        _return.defaultValue = property.initializer ? this.stringifyDefaultValue(property.initializer) : undefined;
        if (!_return.description) {
            if (property.jsDoc) {
                if (property.jsDoc.length > 0) {
                    if (typeof property.jsDoc[0].comment !== 'undefined') {
                        _return.description = marked(property.jsDoc[0].comment);
                    }
                }
            }
        }
        _return.line = this.getPosition(property, sourceFile).line + 1;
        if (property.type) {
            _return.type = this.visitType(property);
        }
        else {
            // handle NewExpression
            if (property.initializer) {
                if (ts.isNewExpression(property.initializer)) {
                    if (property.initializer.expression) {
                        _return.type = property.initializer.expression.text;
                    }
                }
            }
        }
        if (property.kind === ts.SyntaxKind.SetAccessor) {
            // For setter accessor, find type in first parameter
            if (property.parameters && property.parameters.length === 1) {
                if (property.parameters[0].type) {
                    _return.type = kind_to_type_1.kindToType(property.parameters[0].type.kind);
                }
            }
        }
        return _return;
    };
    ClassHelper.prototype.formatDecorators = function (decorators) {
        var _decorators = [];
        _.forEach(decorators, function (decorator) {
            if (decorator.expression) {
                if (decorator.expression.text) {
                    _decorators.push({
                        name: decorator.expression.text
                    });
                }
                if (decorator.expression.expression) {
                    var info = {
                        name: decorator.expression.expression.text
                    };
                    if (decorator.expression.expression.arguments) {
                        if (decorator.expression.expression.arguments.length > 0) {
                            info.args = decorator.expression.expression.arguments;
                        }
                    }
                    _decorators.push(info);
                }
            }
        });
        return _decorators;
    };
    ClassHelper.prototype.visitMethodDeclaration = function (method, sourceFile) {
        var _this = this;
        var result = {
            name: method.name.text,
            args: method.parameters ? method.parameters.map(function (prop) { return _this.visitArgument(prop); }) : [],
            returnType: this.visitType(method.type),
            line: this.getPosition(method, sourceFile).line + 1
        };
        var jsdoctags = this.jsdocParserUtil.getJSDocs(method);
        if (typeof method.type === 'undefined') {
            // Try to get inferred type
            if (method.symbol) {
                var symbol = method.symbol;
                if (symbol.valueDeclaration) {
                    var symbolType = this.typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
                    if (symbolType) {
                        try {
                            var signature = this.typeChecker.getSignatureFromDeclaration(method);
                            var returnType = signature.getReturnType();
                            result.returnType = this.typeChecker.typeToString(returnType);
                            // tslint:disable-next-line:no-empty
                        }
                        catch (error) { }
                    }
                }
            }
        }
        if (method.symbol) {
            result.description = marked(ts.displayPartsToString(method.symbol.getDocumentationComment()));
        }
        if (method.decorators) {
            result.decorators = this.formatDecorators(method.decorators);
        }
        if (method.modifiers) {
            if (method.modifiers.length > 0) {
                result.modifierKind = method.modifiers[0].kind;
            }
        }
        if (jsdoctags && jsdoctags.length >= 1) {
            if (jsdoctags[0].tags) {
                result.jsdoctags = utils_1.markedtags(jsdoctags[0].tags);
            }
        }
        if (result.jsdoctags && result.jsdoctags.length > 0) {
            result.jsdoctags = utils_1.mergeTagsAndArgs(result.args, result.jsdoctags);
        }
        else if (result.args.length > 0) {
            result.jsdoctags = utils_1.mergeTagsAndArgs(result.args);
        }
        return result;
    };
    ClassHelper.prototype.isPipeDecorator = function (decorator) {
        return (decorator.expression.expression) ? decorator.expression.expression.text === 'Pipe' : false;
    };
    ClassHelper.prototype.isModuleDecorator = function (decorator) {
        return (decorator.expression.expression) ? decorator.expression.expression.text === 'NgModule' : false;
    };
    ClassHelper.prototype.visitOutput = function (property, outDecorator, sourceFile) {
        var inArgs = outDecorator.expression.arguments;
        var _return = {
            name: (inArgs.length > 0) ? inArgs[0].text : property.name.text,
            defaultValue: property.initializer ? this.stringifyDefaultValue(property.initializer) : undefined
        };
        if (property.symbol) {
            _return.description = marked(ts.displayPartsToString(property.symbol.getDocumentationComment()));
        }
        if (!_return.description) {
            if (property.jsDoc && property.jsDoc.length > 0) {
                if (typeof property.jsDoc[0].comment !== 'undefined') {
                    _return.description = marked(property.jsDoc[0].comment);
                }
            }
        }
        _return.line = this.getPosition(property, sourceFile).line + 1;
        if (property.type) {
            _return.type = this.visitType(property);
        }
        else {
            // handle NewExpression
            if (property.initializer) {
                if (ts.isNewExpression(property.initializer)) {
                    if (property.initializer.expression) {
                        _return.type = property.initializer.expression.text;
                    }
                }
            }
        }
        return _return;
    };
    ClassHelper.prototype.visitArgument = function (arg) {
        var _this = this;
        var _result = {
            name: arg.name.text,
            type: this.visitType(arg)
        };
        if (arg.dotDotDotToken) {
            _result.dotDotDotToken = true;
        }
        if (arg.questionToken) {
            _result.optional = true;
        }
        if (arg.type) {
            if (arg.type.kind) {
                if (ts.isFunctionTypeNode(arg.type)) {
                    _result.function = arg.type.parameters ? arg.type.parameters.map(function (prop) { return _this.visitArgument(prop); }) : [];
                }
            }
        }
        return _result;
    };
    ClassHelper.prototype.getPosition = function (node, sourceFile) {
        var position;
        if (node.name && node.name.end) {
            position = ts.getLineAndCharacterOfPosition(sourceFile, node.name.end);
        }
        else {
            position = ts.getLineAndCharacterOfPosition(sourceFile, node.pos);
        }
        return position;
    };
    ClassHelper.prototype.visitHostListener = function (property, hostListenerDecorator, sourceFile) {
        var _this = this;
        var inArgs = hostListenerDecorator.expression.arguments;
        var _return = {};
        _return.name = (inArgs.length > 0) ? inArgs[0].text : property.name.text;
        _return.args = property.parameters ? property.parameters.map(function (prop) { return _this.visitArgument(prop); }) : [];
        _return.argsDecorator = (inArgs.length > 1) ? inArgs[1].elements.map(function (prop) {
            return prop.text;
        }) : [];
        if (property.symbol) {
            _return.description = marked(ts.displayPartsToString(property.symbol.getDocumentationComment()));
        }
        if (!_return.description) {
            if (property.jsDoc) {
                if (property.jsDoc.length > 0) {
                    if (typeof property.jsDoc[0].comment !== 'undefined') {
                        _return.description = marked(property.jsDoc[0].comment);
                    }
                }
            }
        }
        _return.line = this.getPosition(property, sourceFile).line + 1;
        return _return;
    };
    return ClassHelper;
}());
exports.ClassHelper = ClassHelper;
//# sourceMappingURL=class-helper.js.map