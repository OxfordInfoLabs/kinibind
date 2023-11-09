"use strict";
/**
 * Object operation formatters
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ObjectFormatters = {
    member: {
        read: function (value, member) {
            return value ? value[member] : null;
        }
    },
    keys: function (value) {
        return value ? Object.keys(value) : [];
    },
    values: function (value) {
        if (value) {
            var values_1 = [];
            Object.keys(value).forEach(function (key) {
                values_1.push(value[key]);
            });
            return values_1;
        }
        else {
            return [];
        }
    },
    // Combine multiple objects using their members via the spread operator
    combine: function (value) {
        var object = __assign({}, value);
        for (var arg = 1; arg < arguments.length; arg++) {
            if (typeof arguments[arg] == "object")
                object = __assign(__assign({}, object), arguments[arg]);
        }
        return object;
    },
    // Create a blank object from any input
    blankObject: function (value) {
        return {};
    }
};
exports.default = ObjectFormatters;
