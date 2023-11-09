"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Array adapter - handles mapping of expressions with [] in.
 */
var ArrayAdapter = {
    observe: function (obj, keypath, callback) {
        keypath = keypath.substr(0, keypath.length - 1).replace(/'/g, '').replace(/"/g, '');
        if (obj.on)
            obj.on('change:' + keypath, callback);
    },
    unobserve: function (obj, keypath, callback) {
        keypath = keypath.substr(0, keypath.length - 1).replace(/'/g, '').replace(/"/g, '');
        if (obj.off)
            obj.off('change:' + keypath, callback);
    },
    get: function (obj, keypath) {
        keypath = keypath.substr(0, keypath.length - 1).replace(/'/g, '').replace(/"/g, '');
        return obj[keypath];
    },
    set: function (obj, keypath, value) {
        keypath = keypath.substr(0, keypath.length - 1).replace(/'/g, '').replace(/"/g, '');
        obj[keypath] = value;
    }
};
exports.default = ArrayAdapter;
