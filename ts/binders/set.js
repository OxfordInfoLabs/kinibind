"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tinybind = require("tinybind");
/**
 * Toggle class
 */
var Set = {
    priority: 4000,
    // Simply update the model value
    routine: function (el, value) {
        // Convert hyphenated form to camel case for variable names
        var variableName = this.arg.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
        });
        var model = el.kinibindSetContexts && el.kinibindSetContexts[variableName] ? el.kinibindSetContexts[variableName] : this.view.models;
        model[variableName] = value;
        // Observe the new property
        tinybind.adapters[tinybind.rootInterface].observe(model, variableName, {
            sync: function () {
            }
        });
    }
};
exports.default = Set;
