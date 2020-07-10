import {sha256} from 'js-sha256';

/**
 * String only formatters
 *
 */
let StringFormatters = {

    append: function (value, otherValue) {
        let string = "";
        for (var arg = 0; arg < arguments.length; arg++) {
            string += arguments[arg];
        }
        return string;
    },

    prepend: function (value, otherValue) {
        let string = "";
        for (var arg = 1; arg < arguments.length; arg++) {
            string += arguments[arg];
        }

        return string + value;
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
    },

    hash: function (value) {
        return sha256(value);
    }

}

export default StringFormatters;
