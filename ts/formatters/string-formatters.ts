import {sha256} from 'js-sha256';
import * as md5 from "js-md5";

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
        return value.replace(/<[^>]*>/g, '');
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
