/**
 * Maths operation formatters
 */
let MathsFormatters = {


    add: function (value: any, otherModel: any) {
        return Number(value) + Number(otherModel);
    },

    subtract: function (value: any, otherModel: any) {
        return Number(value) - Number(otherModel);
    },

    multiply: function (value: any, otherModel: any) {
        return Number(value) * Number(otherModel);
    },

    divide: function (value: any, otherModel: any) {
        return Number(value) / Number(otherModel);
    },

    modulo: function (value: any, otherModel: any) {
        return Number(value) % Number(otherModel);
    },

    decimalplaces: function (value: any, dp: any) {
        return Number(value).toFixed(dp);
    },

    commaseparatedthousands: function (value: any) {
        return Number(value).toLocaleString("en-US");
    },

    floor: function (value: any) {
        return Math.floor(Number(value));
    },
    ceil: function (value: any) {
        return Math.ceil(Number(value));
    },
    round: function (value: any) {
        return Math.round(Number(value));
    },
    random: function (min: any, max: any) {
        return min + Math.round(Math.random() * (max - min));
    }

}

export default MathsFormatters;
