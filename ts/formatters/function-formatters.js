"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FunctionFormatters = {
    // Function argument formatter - allows for arbitrary args to
    // be passed to a custom function
    args: function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function (event) { return fn.apply(null, args.concat([event])); };
    }
};
exports.default = FunctionFormatters;
