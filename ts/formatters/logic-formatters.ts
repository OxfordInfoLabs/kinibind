/**
 * Standard and enhanced logic functions
 */
let LogicFormatters = {

    equals: function (value, otherValue) {
        return value == otherValue;
    },

    notequals: function (value, otherValue) {
        return value != otherValue;
    },

    not: function (value) {
        return !value;
    },

    gt: function (value, otherValue) {
        return value > otherValue;
    },


    gte: function (value, otherValue) {
        return value >= otherValue;
    },

    lt: function (value, otherValue) {
        return value < otherValue;
    },

    lte: function (value, otherValue) {
        return value <= otherValue;
    },

    between: function (value, lowValue, highValue) {
        return value >= lowValue && value <= highValue;
    },

    and: function (value, otherValue) {
        return value && otherValue;
    },

    or: function (value, otherValue) {
        return value || otherValue;
    },


    // Combined convenience functions
    andNot: function (value, otherValue) {
        return value && !otherValue;
    },

    // Or-not logic
    orNot: function (value, otherValue) {
        return value || !otherValue;
    },

    // Ternary expression
    ternary: function (expression, trueValue, falseValue) {
        return expression ? trueValue : falseValue;
    },

    // If not expression - i.e. if argument not set use alternative
    ifNot: function (value, otherValue) {
        return value ? value : otherValue;
    },

    // Case expression, accepts key value pairs and matches the first one
    "case": function (value) {

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
    countArray: function (from, to) {
        let countArray = [];
        for (var i = from; i <= to; i++) {
            countArray.push(i);
        }
        return countArray;
    }


};

export default LogicFormatters;
