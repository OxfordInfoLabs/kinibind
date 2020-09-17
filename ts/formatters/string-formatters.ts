import {sha256} from 'js-sha256';
import {md5} from 'md5';

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
    },

    md5: function (value) {
        return md5(value);
    },

    // Regex and standard replacement in one.
    replace: function (value, find, replace) {

        if (find.substr(0, 1) == "/") {

            let split = find.split("/");
            let modifiers = split.pop();
            split.shift();
            find = new RegExp(split.join("/"), modifiers);

        }
        return value.replace(find, replace);
    }

}

export default StringFormatters;
