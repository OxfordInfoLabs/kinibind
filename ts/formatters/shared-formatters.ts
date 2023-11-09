/**
 * Array and string shared formatters
 */
let SharedFormatters = {

    contains: function (value: any, contains: any) {
        if (value) {
            return value.indexOf(contains) >= 0
        } else {
            return false;
        }
    },

    length: function (value: any) {
        if (value instanceof Array)
            return value.length;
        else if (value) {
            return value.length;
        }
        return false;
    }

}

export default SharedFormatters;
