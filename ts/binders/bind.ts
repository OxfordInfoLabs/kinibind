/**
 * Toggle class
 */

import tinybind from "tinybind";


let Bind = {

    block: true,
    priority: 4000,

    bind: function (el) {
        let model = {parent: this.view.models, ...this.view.models};
        tinybind.bind(el, model);
        return model;
    }

}

export default Bind;
