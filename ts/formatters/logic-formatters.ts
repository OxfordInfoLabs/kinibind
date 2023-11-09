/**
 * Standard and enhanced logic functions
 */
let LogicFormatters = {

    equals: function (value: any, otherValue: any) {
        return value == otherValue;
    },

    notequals: function (value: any, otherValue: any) {
        return value != otherValue;
    },

    not: function (value: any) {
        return !value;
    },

    gt: function (value: any, otherValue: any) {
        return value > otherValue;
    },


    gte: function (value: any, otherValue: any) {
        return value >= otherValue;
    },

    lt: function (value: any, otherValue: any) {
        return value < otherValue;
    },

    lte: function (value: any, otherValue: any) {
        return value <= otherValue;
    },

    between: function (value: any, lowValue: any, highValue: any) {
        return value >= lowValue && value <= highValue;
    },

    and: function (value: any, otherValue: any) {
        return value && otherValue;
    },

    or: function (value: any, otherValue: any) {
        return value || otherValue;
    },


    // Combined convenience functions
    andNot: function (value: any, otherValue: any) {
        return value && !otherValue;
    },

    // Or-not logic
    orNot: function (value: any, otherValue: any) {
        return value || !otherValue;
    },

    // Ternary expression
    ternary: function (expression: any, trueValue: any, falseValue: any) {
        return expression ? trueValue : falseValue;
    },

    // If not expression - i.e. if argument not set use alternative
    ifNot: function (value: any, otherValue: any) {
        return value ? value : otherValue;
    },

    // Case expression, accepts key value pairs and matches the first one
    "case": function (value: any) {

        // Loop through pairs of values to check
        for (var arg = 1; arg < arguments.length; arg += 2) {
            let compareValue = arguments[arg];

            // If we have a lone value assume it's the default value and return
            if (arg + 1 == arguments.length) {
                return compareValue;
            }

            // Otherwise, return next value on a match
            if (compareValue == value) {
                return arguments[arg + 1];
            }
        }
        return null;

    },

    // Fill an array with numbers from the from to the to
    // for looping purposes
    countArray: function (from: any, to: any) {
        let countArray: any = [];
        for (var i = from; i <= to; i++) {
            countArray.push(i);
        }
        return countArray;
    }


};

export default LogicFormatters;
