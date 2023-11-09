"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Toggle class
 */
var Toggle = {
    publishes: true,
    bind: function (el) {
        var observer = this.observer;
        if (!this.callback) {
            this.callback = function (event) {
                // if special initialise object toggle mode initialise the object
                if (el.getAttribute("initialise-object")) {
                    observer.setValue({});
                }
                else {
                    var toggleValues = null;
                    if (el.getAttribute("toggle-values")) {
                        toggleValues = el.getAttribute("toggle-values").split(",");
                    }
                    if (toggleValues) {
                        var position = toggleValues.indexOf(observer.value());
                        position++;
                        position = position % toggleValues.length;
                        var value = toggleValues[position].trim();
                        if (value == "true") {
                            value = true;
                        }
                        else if (value == "false") {
                            value = false;
                        }
                        observer.setValue(value);
                    }
                    else {
                        observer.setValue(!observer.value());
                    }
                }
            };
        }
        var toggleEvent = el.getAttribute("toggle-event") ? el.getAttribute("toggle-event") : "click";
        el.addEventListener(toggleEvent, this.callback);
    },
    unbind: function (el) {
        el.removeEventListener("click", this.callback);
    }
};
exports.default = Toggle;
