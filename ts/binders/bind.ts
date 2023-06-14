/**
 * Toggle class
 */


let Bind = {

    block: true,
    priority: 4000,

    bind: function (el) {

        // Create a clean model
        let model = {};
        window["tinybind"].bind(el, model);

        // Sort out parent model
        model['$parent'] = this.view.models;

        el.dataset.kinibound = "1";
        el.boundModel = model;

        return model;
    }

}

export default Bind;
