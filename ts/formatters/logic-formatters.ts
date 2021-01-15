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
    },

    // If not expression - i.e. if argument not set use alternative
    ifNot: function(value, otherValue){
      return value ? value : otherValue;
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
