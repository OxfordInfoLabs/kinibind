/**
 * Toggle class
 */

import Kinibind from "../kinibind";

let ComponentBind = {

    block: true,
    priority: 4000,

    // Call bind logic and
    bind: function (el) {

        // Create a clean model
        let model = {};
        // Sort out parent model
        model['$parent'] = this.view.models;

        if (Kinibind.components[this.arg] && el.ownerDocument) {
            let constructor = Kinibind.components[this.arg];
            new constructor(el, model, model['$parent'], el.ownerDocument);
        }

        window["tinybind"].bind(el, model);

    }

}

export default ComponentBind;
