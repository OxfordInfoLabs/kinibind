"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Checked binder - overrides the default one to allow for one way binding
 *
 * @param checkedBinder
 * @constructor
 */
function Checked(checkedBinder) {
    checkedBinder.coreBind = checkedBinder.bind;
    checkedBinder.bind = function (el) {
        if (el.hasAttribute('one-way')) {
            return;
        }
        else {
            checkedBinder.coreBind.call(this, el);
        }
    };
    return checkedBinder;
}
exports.default = Checked;
