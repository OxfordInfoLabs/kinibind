"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Multi Check class
 */
var MultiCheck = {
    publishes: true,
    bind: function (el) {
        var observer = this.observer;
        if (!this.callback) {
            this.callback = function (event) {
                var checkedValues = [];
                el.querySelectorAll("input[type='checkbox']").forEach(function (checkbox) {
                    if (checkbox.checked && checkbox.dataset.value) {
                        checkedValues.push(checkbox.dataset.value);
                    }
                });
                observer.setValue(checkedValues.length ? checkedValues : null);
            };
        }
        // Initialise values
        var checkedValues = observer.value() || [];
        el.querySelectorAll("input[type='checkbox']").forEach(function (checkbox) {
            checkbox.checked = checkedValues.includes(checkbox.dataset.value);
        });
        // Ensure we update checked items on dom modifications
        el.addEventListener("DOMSubtreeModified", (function (event) {
            var checkedValues = observer.value() || [];
            el.querySelectorAll("input[type='checkbox']").forEach(function (checkbox) {
                checkbox.checked = checkedValues.includes(checkbox.dataset.value);
            });
        }));
        el.addEventListener("change", this.callback);
    },
    unbind: function (el) {
        el.removeEventListener("change", this.callback);
    }
};
exports.default = MultiCheck;
