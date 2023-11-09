"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var js_sha256_1 = require("js-sha256");
var md5 = require("js-md5");
var htmlToText = require("html-to-text").htmlToText;
/**
 * String only formatters
 *
 */
var StringFormatters = {
    append: function (value, otherValue) {
        var string = "";
        for (var arg = 0; arg < arguments.length; arg++) {
            string += arguments[arg];
        }
        return string;
    },
    prepend: function (value, otherValue) {
        var string = "";
        for (var arg = 1; arg < arguments.length; arg++) {
            string += arguments[arg];
        }
        return string + value;
    },
    split: function (value, splitCharacter) {
        if (splitCharacter === void 0) { splitCharacter = ","; }
        return value ? value.split(splitCharacter) : [];
    },
    substring: function (value, start, end) {
        return value ? value.substring(start, end) : '';
    },
    uppercase: function (value) {
        return value ? value.toUpperCase() : '';
    },
    lowercase: function (value) {
        return value ? value.toLowerCase() : '';
    },
    trim: function (value) {
        return value ? value.trim() : '';
    },
    initialCaps: function (value) {
        return value && value.length > 1 ? value.substring(0, 1).toUpperCase() + value.substring(1).toLowerCase() :
            value.toUpperCase();
    },
    words: function (value) {
        if (value) {
            return value.split(/\W/).length;
        }
        else {
            return 0;
        }
    },
    hash: function (value) {
        return (0, js_sha256_1.sha256)(value);
    },
    md5: function (value) {
        return md5(value);
    },
    urlencode: function (value) {
        return encodeURI(value);
    },
    urlencodeparams: function (value) {
        try {
            var url = new URL(value);
            var queryString = url.searchParams.toString();
            return url.origin + url.pathname + (queryString ? "?" + queryString : "");
        }
        catch (e) {
            return value;
        }
    },
    // Regex and standard replacement in one.
    replace: function (value, find, replace) {
        if (find.substr(0, 1) == "/") {
            var split = find.split("/");
            var modifiers = split.pop();
            split.shift();
            find = new RegExp(split.join("/"), modifiers);
            return value.replace(find, replace);
        }
        else {
            return value.replaceAll(find, replace);
        }
    },
    startsWith: function (value, prefix) {
        return value ? value.startsWith(prefix) : false;
    },
    endsWith: function (value, suffix) {
        return value ? value.endsWith(suffix) : false;
    },
    contains: function (value, string) {
        return value ? value.includes(string) : false;
    },
    htmlToText: function (value, escapeCharacters) {
        if (escapeCharacters === void 0) { escapeCharacters = ""; }
        return htmlToText(value);
    },
    toJSON: function (value) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return null;
        }
    }
};
exports.default = StringFormatters;
