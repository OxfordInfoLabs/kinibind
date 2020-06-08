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
    }


};

export default LogicFormatters;
