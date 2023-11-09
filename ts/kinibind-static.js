"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_html_parser_1 = require("node-html-parser");
var date_formatters_1 = __importDefault(require("./formatters/date-formatters"));
var string_formatters_1 = __importDefault(require("./formatters/string-formatters"));
var array_formatters_1 = __importDefault(require("./formatters/array-formatters"));
var shared_formatters_1 = __importDefault(require("./formatters/shared-formatters"));
var object_formatters_1 = __importDefault(require("./formatters/object-formatters"));
var maths_formatters_1 = __importDefault(require("./formatters/maths-formatters"));
var logic_formatters_1 = __importDefault(require("./formatters/logic-formatters"));
var function_formatters_1 = __importDefault(require("./formatters/function-formatters"));
var debug_formatters_1 = __importDefault(require("./formatters/debug-formatters"));
/**
 * Static kinibind implementation for fast DOM parsing of static structures (mostly used in NodeJS)
 */
var KinibindStatic = /** @class */ (function () {
    function KinibindStatic() {
    }
    /**
     * Parse some html with an associated model
     *
     * @param html - The input HTML for parsing
     * @param model - The model to use for parsing the html
     * @param prefix - The default prefix for attributes
     * @param delimiters - The default delimiters for literal properties
     * @param stripTags - Removes any tags after parsing (useful when parsing non-html content)
     *
     * @return string
     */
    KinibindStatic.prototype.parse = function (html, model, prefix, delimiters, stripTags) {
        if (model === void 0) { model = {}; }
        if (prefix === void 0) { prefix = "k"; }
        if (delimiters === void 0) { delimiters = ["{", "}"]; }
        if (stripTags === void 0) { stripTags = false; }
        delimiters = [delimiters[0].replace(/\[/g, "\\["), delimiters[1]];
        // Escape HTML quotes
        html = html.replace(/&quot;/g, '##ESCAPEQUOTE');
        var htmlDocument = (0, node_html_parser_1.parse)(html);
        var processed = this._processElement(htmlDocument, prefix, delimiters, model);
        if (stripTags) {
            processed = processed.replace(/<.*?>/g, '');
        }
        // Add HTML quotes back to preserve
        processed = processed.replace(/##ESCAPEQUOTE/g, "&quot;");
        return processed;
    };
    /**
     * Add formatters to be merged into the global set.
     *
     * @param object formatters
     */
    KinibindStatic.addFormatters = function (formatters) {
        this.FORMATTERS = __assign(__assign({}, this.FORMATTERS), formatters);
    };
    /**
     * Add binders to be processed before any attributes are processed.
     * This should be an object of functions keyed in by binder key.
     *
     * The function spec should be
     *
     * function (el: any, value: any)
     *
     * @param binders
     */
    KinibindStatic.addBinders = function (binders) {
        this.BINDERS = __assign(__assign({}, this.BINDERS), binders);
    };
    /**
     * Process an element for nested content observing the correct order
     *
     * @param domElement
     * @param prefix
     * @param model
     * @private
     */
    KinibindStatic.prototype._processElement = function (domElement, prefix, delimiters, model) {
        // Process if expressions
        this._processPrecendentExpressions(domElement, prefix, delimiters, model);
        // Evaluate any adhoc attributes
        this._evaluateAttributes(domElement, prefix, model);
        // Do a final literal replacement on remaining content
        var content = domElement.toString();
        return this._replaceLiterals(content, model, delimiters);
    };
    // Process if expressions
    KinibindStatic.prototype._processPrecendentExpressions = function (domElement, prefix, delimiters, model) {
        var _this = this;
        // Find all possible distinct prefix attributes
        var attributeMatch;
        var lastIndex = -1;
        var _loop_1 = function () {
            attributeMatch = domElement.toString().match(new RegExp(prefix + "-(each-.*?|if|set-.*?)="));
            if (attributeMatch) {
                lastIndex = attributeMatch.index;
                var element_1 = domElement.querySelector("[" + prefix + "-" + attributeMatch[1] + "]");
                var evaluatedExpression = this_1._processExpression(element_1.getAttribute(prefix + "-" + attributeMatch[1]), model);
                // Handle if case first
                if (attributeMatch[1] == "if") {
                    if (!evaluatedExpression) {
                        element_1.remove();
                    }
                    else {
                        element_1.removeAttribute(prefix + "-if");
                    }
                }
                // Handle set next
                else if (attributeMatch[1].startsWith("set-")) {
                    var modelProperty = attributeMatch[1].substr(4);
                    model[modelProperty] = evaluatedExpression;
                    element_1.removeAttribute(prefix + "-" + attributeMatch[1]);
                }
                else {
                    // Only process if valid array
                    if (evaluatedExpression instanceof Array) {
                        var loopVariable_1 = attributeMatch[1].substr("5");
                        element_1.removeAttribute(prefix + "-" + attributeMatch[1]);
                        // Loop through each iteration
                        var processedString_1 = "";
                        evaluatedExpression.forEach(function (item, index) {
                            model[loopVariable_1] = item;
                            model["$index"] = index;
                            var clonedElement = (0, node_html_parser_1.parse)(element_1.toString());
                            processedString_1 += _this._processElement(clonedElement, prefix, delimiters, model);
                        });
                        element_1.replaceWith(processedString_1);
                    }
                    else {
                        element_1.remove();
                    }
                }
            }
        };
        var this_1 = this;
        do {
            _loop_1();
        } while (attributeMatch);
    };
    // Evaluate attributes for supplied prefix within the contained element using model
    KinibindStatic.prototype._evaluateAttributes = function (domElement, prefix, model) {
        var _this = this;
        // Find all possible distinct prefix attributes
        var attributeMatches = domElement.toString().match(new RegExp(prefix + "-.*?=", "g"));
        // If matches
        if (attributeMatches) {
            // Ensure matches are distinct
            attributeMatches = attributeMatches.filter(function (item, index, self) {
                return self.indexOf(item) === index;
            });
            // Evaluate all attributes
            attributeMatches.forEach(function (matchingAttribute) {
                matchingAttribute = matchingAttribute.substr(0, matchingAttribute.length - 1);
                var newAttribute = matchingAttribute.substr(prefix.length + 1);
                var elements = domElement.querySelectorAll("[" + matchingAttribute + "]");
                elements.forEach(function (element) {
                    var evaluatedAttributeValue = _this._processExpression(element.getAttribute(matchingAttribute), model);
                    // Switch special cases
                    switch (newAttribute) {
                        case "text":
                            element.textContent = evaluatedAttributeValue;
                            break;
                        case "html":
                            element.innerHTML = evaluatedAttributeValue;
                            break;
                        default:
                            // if we start with class- we assume this is a class
                            // related attribute
                            if (newAttribute.startsWith("has-")) {
                                var attributeName = newAttribute.substr(4);
                                if (evaluatedAttributeValue) {
                                    element.setAttribute(attributeName, "");
                                }
                                else {
                                    element.removeAttribute(attributeName);
                                }
                            }
                            else if (newAttribute.startsWith("class-")) {
                                var className = newAttribute.substr(6);
                                var classes = element.getAttribute("class") ? element.getAttribute("class").split(" ") : [];
                                var existingIndex = classes.indexOf(className);
                                if (evaluatedAttributeValue) {
                                    if (existingIndex < 0)
                                        classes.push(className);
                                }
                                else {
                                    if (existingIndex >= 0)
                                        classes.splice(existingIndex, 1);
                                }
                                element.setAttribute("class", classes.join(" "));
                            }
                            else if (KinibindStatic.BINDERS[newAttribute]) {
                                KinibindStatic.BINDERS[newAttribute].apply(KinibindStatic.BINDERS, [element, evaluatedAttributeValue]);
                            }
                            else
                                element.setAttribute(newAttribute, evaluatedAttributeValue);
                            break;
                    }
                    element.removeAttribute(matchingAttribute);
                });
            });
        }
    };
    // Replace literals in a passed string
    KinibindStatic.prototype._replaceLiterals = function (string, model, delimiters) {
        var _this = this;
        var regExp = new RegExp(delimiters[0] + "(.*?)" + delimiters[1], "g");
        return string.replace(regExp, function (fullMatch, content) {
            return _this._processExpression(content, model);
        });
    };
    // Process an expression using the passed model
    KinibindStatic.prototype._processExpression = function (expression, model) {
        var _this = this;
        // Substitute expressions in '' to avoid problems with the split
        var captured = [];
        expression = String(expression).replace(/['"].*?['"]/g, function (match) {
            captured.push(match);
            return '#' + (captured.length - 1);
        });
        var expressions = expression.split(" | ");
        // Always process the first item as this is the hook item
        var firstItem = expressions.shift().trim();
        if (firstItem.substr(0, 1) == "#")
            firstItem = captured[Number(firstItem.substr(1))];
        var value = this._evaluateValue(firstItem, model);
        // Now process each expression
        expressions.forEach(function (expression) {
            var components = expression.split(' ');
            // Grab formatter as first arg
            var formatter = components.shift().trim();
            var formatterArgs = [value];
            // Evaluate each component first substituting any # substitutions from earlier.
            components.forEach(function (component) {
                if (component.substr(0, 1) == "#")
                    component = captured[Number(component.substr(1))];
                if (component)
                    component.trim();
                formatterArgs.push(_this._evaluateValue(component, model));
            });
            var formatterMethod = KinibindStatic.FORMATTERS[formatter];
            // If a nested read method, use this
            if (formatterMethod && formatterMethod.read)
                formatterMethod = formatterMethod.read;
            if (formatterMethod && formatterMethod.apply) {
                value = formatterMethod.apply(KinibindStatic.FORMATTERS, formatterArgs);
            }
        });
        return value;
    };
    // Evaluate a value as passed as part of an expression
    // This should either be:
    // 1) a string enclosed in single or double quotes
    // 2) a number literal
    // 3) another string which will be assumed to be a path into the model
    KinibindStatic.prototype._evaluateValue = function (value, model) {
        if (value === undefined)
            return '';
        // Check for number first
        if (!isNaN(Number(value)))
            return Number(value);
        // Boolean literals
        if (value === "true")
            return true;
        if (value === "false")
            return false;
        // Check for enclosed string next
        var stringMatches = value.match(/['"](.*?)['"]/);
        if (stringMatches && stringMatches[1])
            return stringMatches[1];
        // Else assume model path
        var splitModelPath = value.split(/[\.\[\]]/);
        var returnValue = model;
        splitModelPath.forEach(function (pathElement) {
            if (pathElement == "")
                return;
            returnValue = returnValue ? returnValue[pathElement] : null;
        });
        return returnValue === undefined ? '' : returnValue;
    };
    // Formatter collection
    KinibindStatic.FORMATTERS = __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, date_formatters_1.default), string_formatters_1.default), array_formatters_1.default), shared_formatters_1.default), object_formatters_1.default), maths_formatters_1.default), logic_formatters_1.default), function_formatters_1.default), debug_formatters_1.default);
    // Binder collection
    KinibindStatic.BINDERS = {};
    return KinibindStatic;
}());
exports.default = KinibindStatic;
