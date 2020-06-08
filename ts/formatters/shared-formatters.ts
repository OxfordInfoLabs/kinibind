/**
 * Array and string shared formatters
 */
let SharedFormatters = {

    contains: function (value, contains) {
        if (value instanceof Array)
            return value.indexOf(contains) >= 0
        else if (value) {
            return value.includes(contains);
        }
        return false;
    },

    length: function (value, contains) {
        if (value instanceof Array)
            return value.length;
        else if (value) {
            return value.length;
        }
        return false;
    }
}

export default SharedFormatters;
