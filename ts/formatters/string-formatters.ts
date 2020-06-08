/**
 * String only formatters
 *
 */
let StringFormatters = {

    concat: function (value, otherValue) {
        return value + otherValue;
    },

    split: function (value, splitCharacter = ",") {
        return value ? value.split(splitCharacter) : [];
    },

    substring: function (value, start, end) {
        return value ? value.substring(start, end) : '';
    },

    words: function (value) {
        if (value) {
            return value.split(/\W/).length;
        } else {
            return 0;
        }
    }

}

export default StringFormatters;
