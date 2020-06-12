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
    },

    decimalplaces: function (value, dp) {
        return value.toFixed(dp);
    },

    floor: function (value) {
        return Math.floor(value);
    },
    ceil: function (value) {
        return Math.ceil(value);
    },
    round: function (value) {
        return Math.round(value);
    }

}

export default MathsFormatters;
