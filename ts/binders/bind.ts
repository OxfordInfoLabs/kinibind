/**
 * Toggle class
 */

import tinybind from "tinybind";


let Bind = {

    block: true,
    priority: 4000,

    bind: function (el) {
        let model = {parent: this.view.models};
        tinybind.bind(el, model);

        // Sort out parent model
        model['$parent'] = model['parent'];
        delete model.parent;

        return model;
    }

}

export default Bind;
