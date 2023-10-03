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
        let model = {'$global': this.view.models['$global'] || this.view.models};

        window["tinybind"].bind(el, model);

        // Sort out parent and global models
        model['$parent'] = this.view.models;

        if (Kinibind.components[this.arg] && el.ownerDocument) {
            let constructor = Kinibind.components[this.arg];
            new constructor(el, model, this.view.models, el.ownerDocument);
        }

        el.dataset.kinibound = "1";
        el.boundModel = model;

    }

}

export default ComponentBind;
