"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Debug formatters useful in development
 */
var DebugFormatters = {
    dump: function (value) {
        try {
            return JSON.stringify(value);
        }
        catch (e) {
            console.log(value);
            return "NON-JSON value - see console logs";
        }
    }
};
exports.default = DebugFormatters;
