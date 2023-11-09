"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Toggle class
 */
var SetContext = {
    priority: 5000,
    // Simply update the model value
    routine: function (el, value) {
        if (!el.kinibindSetContexts) {
            el.kinibindSetContexts = {};
        }
        // Convert hyphenated form to camel case for variable names
        var variableName = this.arg.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
        });
        el.kinibindSetContexts[variableName] = value;
    }
};
exports.default = SetContext;
