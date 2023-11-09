"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Toggle class
 */
var Has = {
    priority: 4000,
    // Simply update the model value
    routine: function (el, value) {
        if (value) {
            el.setAttribute(this.arg, '');
        }
        else {
            el.removeAttribute(this.arg);
        }
    }
};
exports.default = Has;
