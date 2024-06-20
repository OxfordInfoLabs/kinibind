import {sha256} from 'js-sha256';
import {md5} from "js-md5";

/**
 * String only formatters
 *
 */
let StringFormatters = {

    append: function (value: any, otherValue: any) {
        let string = "";
        for (var arg = 0; arg < arguments.length; arg++) {
            string += arguments[arg];
        }
        return string;
    },

    prepend: function (value: any, otherValue: any) {
        let string = "";
        for (var arg = 1; arg < arguments.length; arg++) {
            string += arguments[arg];
        }

        return string + value;
    },

    split: function (value: any, splitCharacter = ",") {
        return value ? value.split(splitCharacter) : [];
    },

    substring: function (value: any, start: any, end: any) {
        return value ? value.substring(start, end) : '';
    },

    substringIndex: function (value: any, substring: string, caseSensitive = false) {
        // If not case sensitive, ensure this is conformed to
        if (value) {
            if (!caseSensitive) {
                value = value.toLowerCase();
                substring = substring.toLowerCase();
            }
            return value.indexOf(substring);
        } else {
            return '';
        }
    },

    uppercase: function (value: any) {
        return value ? value.toUpperCase() : '';
    },

    lowercase: function (value: any) {
        return value ? value.toLowerCase() : '';
    },

    trim: function (value: any) {
        return value ? value.trim() : '';
    },

    initialCaps: function (value: any) {
        return value && value.length > 1 ? value.substring(0, 1).toUpperCase() + value.substring(1).toLowerCase() :
            value.toUpperCase();
    },

    words: function (value: any) {
        if (value) {
            return value.split(/\W/).length;
        } else {
            return 0;
        }
    },

    // Return the sentences around a location in the string.  By default this will
    // always return the sentence containing the location but optionally can contain a number of previous and
    // following sentences as well
    sentencesAround: function (value: any, location: number = 0, precedingSentences: number = 0, followingSentences: number = 0) {
        if (location < 0) location = 0;

        // Capture forward sentences
        let forwardContent = value.substr(location).split(".").slice(0, followingSentences + 1).join(".");
        let precedingContent = value.substr(0, location).split("").reverse().join("").split(".").slice(0, precedingSentences + 1).join(".").split("").reverse().join("");

        return precedingContent + forwardContent;

    },

    hash: function (value: any) {
        return sha256(value);
    },

    md5: function (value: any) {
        return (<any>md5)(value);
    },

    urlencode: function (value: any) {
        return encodeURI(value);
    },

    urlencodeparams: function (value: any) {
        try {
            let url = new URL(value);
            let queryString = url.searchParams.toString()
            return url.origin + url.pathname + (queryString ? "?" + queryString : "");
        } catch (e) {
            return value;
        }
    },

    // Regex and standard replacement in one.
    replace: function (value: any, find: any, replace: any) {

        if (find.substr(0, 1) == "/") {

            let split = find.split("/");
            let modifiers = split.pop();
            split.shift();
            find = new RegExp(split.join("/"), modifiers);

            return value.replace(find, replace);

        } else {
            return value.replaceAll(find, replace);
        }
    },

    startsWith: function (value: any, prefix: any) {
        return value ? value.startsWith(prefix) : false;
    },

    endsWith: function (value: any, suffix: any) {
        return value ? value.endsWith(suffix) : false;
    },

    contains: function (value: any, string: any) {
        return value ? value.includes(string) : false;
    },

    htmlToText: function (value: any, escapeCharacters: string = "") {
        return value ? String(value).replace(/<[^>]*>/g, '') : '';
    },

    highlightSubstring: function (value: any, substring: string, wrapper: string = "<b>match</b>") {
        let regexp = new RegExp("(" + substring + ")", "ig");
        return value.replaceAll(regexp, wrapper.replace("match", "$1"));
    },

    toJSON: function (value: any) {
        try {
            return JSON.parse(value);
        } catch (e) {
            return null;
        }
    }


}

export default StringFormatters;
