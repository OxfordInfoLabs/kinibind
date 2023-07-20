import {parse} from 'node-html-parser';
import DateFormatters from "./formatters/date-formatters";
import StringFormatters from "./formatters/string-formatters";
import ArrayFormatters from "./formatters/array-formatters";
import SharedFormatters from "./formatters/shared-formatters";
import ObjectFormatters from "./formatters/object-formatters";
import MathsFormatters from "./formatters/maths-formatters";
import LogicFormatters from "./formatters/logic-formatters";
import FunctionFormatters from "./formatters/function-formatters";
import DebugFormatters from "./formatters/debug-formatters";

/**
 * Static kinibind implementation for fast DOM parsing of static structures (mostly used in NodeJS)
 */
export default class KinibindStatic {

    // Formatter collection
    protected static FORMATTERS = {
        ...DateFormatters,
        ...StringFormatters,
        ...ArrayFormatters,
        ...SharedFormatters,
        ...ObjectFormatters,
        ...MathsFormatters,
        ...LogicFormatters,
        ...FunctionFormatters,
        ...DebugFormatters
    };


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
    public parse(html: string, model: any = {}, prefix: string = "k", delimiters: string[] = ["{", "}"], stripTags: boolean = false) {

        // Escape HTML quotes
        html = html.replace(/&quot;/g, '##ESCAPEQUOTE');

        let htmlDocument = parse(html);
        let processed = this._processElement(htmlDocument, prefix, delimiters, model);

        if (stripTags) {
            processed = processed.replace(/<.*?>/g, '');
        }

        // Add HTML quotes back to preserve
        processed = processed.replace(/##ESCAPEQUOTE/g, "&quot;");

        return processed;
    }


    /**
     * Add formatters to be merged into the global set.
     *
     * @param object formatters
     */
    public static addFormatters(formatters) {
        this.FORMATTERS = {...this.FORMATTERS, ...formatters};
    }


    /**
     * Process an element for nested content observing the correct order
     *
     * @param domElement
     * @param prefix
     * @param model
     * @private
     */
    private _processElement(domElement: any, prefix: string, delimiters: string[], model: any) {


        // Process if expressions
        this._processPrecendentExpressions(domElement, prefix, delimiters, model);


        // Evaluate any adhoc attributes
        this._evaluateAttributes(domElement, prefix, model);


        // Do a final literal replacement on remaining content
        let content = domElement.toString();
        return this._replaceLiterals(content, model, delimiters);

    }


    // Process if expressions
    private _processPrecendentExpressions(domElement: any, prefix: string, delimiters: string[], model: any) {

        // Find all possible distinct prefix attributes
        let attributeMatch;
        let lastIndex = -1;
        do {
            attributeMatch = domElement.toString().match(new RegExp(prefix + "-(each-.*?|if|set-.*?)="));
            if (attributeMatch) {

                lastIndex = attributeMatch.index;

                let element = domElement.querySelector("[" + prefix + "-" + attributeMatch[1] + "]");

                let evaluatedExpression = this._processExpression(element.getAttribute(prefix + "-" + attributeMatch[1]), model);

                // Handle if case first
                if (attributeMatch[1] == "if") {
                    if (!evaluatedExpression) {
                        element.remove();
                    } else {
                        element.removeAttribute(prefix + "-if");
                    }
                }

                // Handle set next
                else if (attributeMatch[1].startsWith("set-")) {

                    let modelProperty = attributeMatch[1].substr(4);
                    model[modelProperty] = evaluatedExpression;
                    element.removeAttribute(prefix + "-" + attributeMatch[1]);
                } else {
                    // Only process if valid array
                    if (evaluatedExpression instanceof Array) {
                        let loopVariable = attributeMatch[1].substr("5");
                        element.removeAttribute(prefix + "-" + attributeMatch[1]);

                        // Loop through each iteration
                        let processedString = "";
                        evaluatedExpression.forEach((item, index) => {
                            model[loopVariable] = item;
                            model["$index"] = index;
                            let clonedElement = parse(element.toString());
                            processedString += this._processElement(clonedElement, prefix, delimiters, model);
                        });

                        element.replaceWith(processedString);
                    } else {
                        element.remove();
                    }


                }
            }

        } while (attributeMatch);


    }


    // Evaluate attributes for supplied prefix within the contained element using model
    private _evaluateAttributes(domElement: any, prefix: string, model: any) {


        // Find all possible distinct prefix attributes
        let attributeMatches = domElement.toString().match(new RegExp(prefix + "-.*?=", "g"));

        // If matches
        if (attributeMatches) {

            // Ensure matches are distinct
            attributeMatches = attributeMatches.filter((item, index, self) => {
                return self.indexOf(item) === index;
            });


            // Evaluate all attributes
            attributeMatches.forEach((matchingAttribute) => {
                matchingAttribute = matchingAttribute.substr(0, matchingAttribute.length - 1);

                let newAttribute = matchingAttribute.substr(prefix.length + 1);
                let elements = domElement.querySelectorAll("[" + matchingAttribute + "]");

                elements.forEach(element => {

                    let evaluatedAttributeValue = this._processExpression(element.getAttribute(matchingAttribute), model);

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
                                let attributeName = newAttribute.substr(4);
                                if (evaluatedAttributeValue) {
                                    element.setAttribute(attributeName, "");
                                } else {
                                    element.removeAttribute(attributeName);
                                }
                            } else if (newAttribute.startsWith("class-")) {
                                let className = newAttribute.substr(6);
                                let classes = element.getAttribute("class") ? element.getAttribute("class").split(" ") : [];
                                let existingIndex = classes.indexOf(className);
                                if (evaluatedAttributeValue) {
                                    if (existingIndex < 0) classes.push(className);
                                } else {
                                    if (existingIndex >= 0) classes.splice(existingIndex, 1);
                                }
                                element.setAttribute("class", classes.join(" "));
                            } else
                                element.setAttribute(newAttribute, evaluatedAttributeValue);

                            break;
                    }

                    element.removeAttribute(matchingAttribute);
                });
            });
        }

    }


    // Replace literals in a passed string
    private _replaceLiterals(string, model, delimiters) {
        let regExp = new RegExp(delimiters[0] + "(.*?)" + delimiters[1], "g");
        return string.replace(regExp, (fullMatch, content) => {
            return this._processExpression(content, model);
        });
    }


    // Process an expression using the passed model
    private _processExpression(expression, model) {

        // Substitute expressions in '' to avoid problems with the split
        let captured = [];
        expression = expression.replace(/['"].*?['"]/g, (match) => {
            captured.push(match);
            return '#' + (captured.length - 1);
        });


        let expressions = expression.split(" | ");

        // Always process the first item as this is the hook item
        let firstItem = expressions.shift().trim();
        if (firstItem.substr(0, 1) == "#")
            firstItem = captured[Number(firstItem.substr(1))];

        let value = this._evaluateValue(firstItem, model);

        // Now process each expression
        expressions.forEach(expression => {

            let components = expression.split(' ');

            // Grab formatter as first arg
            let formatter = components.shift().trim();
            let formatterArgs = [value];

            // Evaluate each component first substituting any # substitutions from earlier.
            components.forEach(component => {
                if (component.substr(0, 1) == "#")
                    component = captured[Number(component.substr(1))];
                if (component) component.trim();
                formatterArgs.push(this._evaluateValue(component, model));
            });

            let formatterMethod = KinibindStatic.FORMATTERS[formatter];
            if (formatterMethod && formatterMethod.apply) {
                value = formatterMethod.apply(KinibindStatic.FORMATTERS, formatterArgs);
            }

        });

        return value;
    }


    // Evaluate a value as passed as part of an expression
    // This should either be:
    // 1) a string enclosed in single or double quotes
    // 2) a number literal
    // 3) another string which will be assumed to be a path into the model
    private _evaluateValue(value, model) {

        if (value === undefined)
            return '';

        // Check for number first
        if (!isNaN(Number(value))) return Number(value);

        // Boolean literals
        if (value === "true") return true;
        if (value === "false") return false;

        // Check for enclosed string next
        let stringMatches = value.match(/['"](.*?)['"]/);
        if (stringMatches && stringMatches[1])
            return stringMatches[1];

        // Else assume model path
        let splitModelPath = value.split(/[\.\[\]]/);
        let returnValue = model;
        splitModelPath.forEach(pathElement => {
            if (pathElement == "") return;
            returnValue = returnValue ? returnValue[pathElement] : null;
        });
        return returnValue === undefined ? '' : returnValue;

    }


}