/**
 * Maths operation formatters
 */
let MathsFormatters = {


    add: function (value, otherModel) {
        return value + otherModel;
    },

    subtract: function (value, otherModel) {
        return value - otherModel;
    },

    multiply: function (value, otherModel) {
        return value * otherModel;
    },

    divide: function (value, otherModel) {
        return value / otherModel;
    },

    modulo: function (value, otherModel) {
        return value % otherModel;
    }

}

export default MathsFormatters;
