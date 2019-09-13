import {EXTENSIONS} from './constants'
import {parseTemplate, parseType} from './parsers'
import {parseDynamicVariablesInString} from './parsers'
import {intersection} from 'lodash-es';

const kinibind = {
    // Global binders.
    binders: {},

    // Global formatters.
    formatters: {
        eval: function (value, operator, equals) {
            return evaluateBooleanExpression(operator, value, equals);
        }
    },

    // Global sightglass adapters.
    adapters: {},

    // Default attribute prefix.
    _prefix: 'kb',

    _fullPrefix: 'kb-',

    get prefix() {
        return this._prefix
    },

    set prefix(value) {
        this._prefix = value
        this._fullPrefix = value + '-'
    },

    parseTemplate: parseTemplate,

    parseType: parseType,

    // Default template delimiters.
    templateDelimiters: ['{', '}'],

    // Default sightglass root interface.
    rootInterface: '.',

    // Preload data by default.
    preloadData: true,

    // Default event handler.
    handler: function (context, ev, binding) {
        if (this) {
            this.call(context, ev, binding.view.models)
        }
    },

    // Sets the attribute on the element. If no binder above is matched it will fall
    // back to using this binder.
    fallbackBinder: function (el, value) {
        if (value != null) {
            const models = Object.assign(this.view.models, this.view.models.$parent);
            const newValue = parseDynamicVariablesInString(value, models);
            el.setAttribute(this.type, newValue)
        } else {
            el.removeAttribute(this.type)
        }
    },

    // Merges an object literal into the corresponding global options.
    configure: function (options) {
        if (!options) {
            return
        }
        Object.keys(options).forEach(option => {
            let value = options[option]

            if (EXTENSIONS.indexOf(option) > -1) {
                Object.keys(value).forEach(key => {
                    this[option][key] = value[key]
                })
            } else {
                this[option] = value
            }
        })
    }
}

function evaluateBooleanExpression(expression, value1, value2) {

    const matches = {
        "===": function (x, y) {
            return x === y
        },
        "==": function (x, y) {
            return x == y
        },
        ">": function (x, y) {
            return x > y
        },
        ">=": function (x, y) {
            return x >= y
        },
        "<": function (x, y) {
            return x < y
        },
        "<=": function (x, y) {
            return x <= y
        },
        "*": function (x, y) {
            let result = x * y == Math.round(x * y) ? x * y : (x * y).toFixed(2);
            return isNaN(result) ? "" : result;
        },
        "+": function (x, y) {
            return x + y
        },
        "-": function (x, y) {
            return x - y
        },
        "/": function (x, y) {
            let result = x / y == Math.round(x / y) ? x / y : (x / y).toFixed(2);
            return isNaN(result) ? "" : result;
        },
        "IN": function (x, y) {
            return y.split(',').indexOf(x) > -1;
        },
        "CONTAINS": function (x, y) {
            return intersection(y.split(','), x).length > 0;
        },
        "CONTAINS_EMPTY": function (x, y) {
            return intersection(y.split(','), x).length > 0 || typeof x === undefined || x === undefined || x.length === 0;
        }
    }

    return matches[expression](value1, value2);
}

export default kinibind
