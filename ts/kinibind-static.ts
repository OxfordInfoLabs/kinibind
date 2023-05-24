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

        let htmlDocument = parse(html);
        return this._processElement(htmlDocument, prefix, delimiters, model);

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

        // Evaluate any adhoc attributes
        this._evaluateAttributes(domElement, prefix, model);

        // Do a final literal replacement on remaining content
        let content = domElement.toString();
        return this._replaceLiterals(content, model, delimiters);

    }


    // Process if expressions
    private _processIfExpressions(domElement: any, prefix: string, model: any) {

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
                    element.setAttribute(newAttribute, this._processExpression(element.getAttribute(matchingAttribute), model));
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

        let expressions = expression.split(" | ");

        // Always process the first item as this is the hook item
        let value = this._evaluateValue(expressions.shift().trim(), model);

        // Now process each expression
        expressions.forEach(expression => {
            let components = expression.split(" ");
            let formatter = components.shift().trim();
            let formatterArgs = [];
            components.forEach(component => {
                formatterArgs.push(this._evaluateValue(component.trim(), model));
            });

            let formatterMethod = KinibindStatic.FORMATTERS[formatter];
            if (formatterMethod) {
                value = formatterMethod.call(KinibindStatic.FORMATTERS, value, ...formatterArgs);
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

        // Check for number first
        if (!isNaN(Number(value))) return Number(value);

        // Check for enclosed string next
        let stringMatches = value.match(/['"](.*?)['"]/);
        if (stringMatches && stringMatches[1]) return stringMatches[1];

        // Else assume model path
        let splitModelPath = value.split(/[\.\[\]]/);
        let returnValue = model;
        splitModelPath.forEach(pathElement => {
            if (pathElement == "") return;
            returnValue = returnValue[pathElement];
        });
        return returnValue;

    }


}