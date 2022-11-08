/**
 * Maths operation formatters
 */
let MathsFormatters = {


    add: function (value, otherModel) {
        return Number(value) + Number(otherModel);
    },

    subtract: function (value, otherModel) {
        return Number(value) - Number(otherModel);
    },

    multiply: function (value, otherModel) {
        return Number(value) * Number(otherModel);
    },

    divide: function (value, otherModel) {
        return Number(value) / Number(otherModel);
    },

    modulo: function (value, otherModel) {
        return Number(value) % Number(otherModel);
    },

    decimalplaces: function (value, dp) {
        return Number(value).toFixed(dp);
    },

    commaseparatedthousands: function (value) {
        return Number(value).toLocaleString("en-US");
    },

    floor: function (value) {
        return Math.floor(Number(value));
    },
    ceil: function (value) {
        return Math.ceil(Number(value));
    },
    round: function (value) {
        return Math.round(Number(value));
    }

}

export default MathsFormatters;
