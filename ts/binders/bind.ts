/**
 * Toggle class
 */

import tinybind from "tinybind";


let Bind = {

    block: true,
    priority: 4000,

    bind: function (el) {

        // Assign parent and take a copy of the outer model at point of copy
        let model = {parent: this.view.models, ...this.view.models };
        tinybind.bind(el, model);

        // Sort out parent model
        model['$parent'] = model['parent'];
        delete model.parent;

        return model;
    }

}

export default Bind;
