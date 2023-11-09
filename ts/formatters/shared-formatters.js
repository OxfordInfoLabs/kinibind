"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Array and string shared formatters
 */
var SharedFormatters = {
    contains: function (value, contains) {
        if (value) {
            return value.indexOf(contains) >= 0;
        }
        else {
            return false;
        }
    },
    length: function (value) {
        if (value instanceof Array)
            return value.length;
        else if (value) {
            return value.length;
        }
        return false;
    }
};
exports.default = SharedFormatters;
