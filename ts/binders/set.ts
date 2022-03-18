import tinybind from "tinybind";

/**
 * Toggle class
 */
let Set = {

    priority: 4000,

    // Simply update the model value
    routine: function (el, value) {

        let model = this.view.models;
        model[this.arg] = value;

        // Observe the new property
        tinybind.adapters[tinybind.rootInterface].observe(model, this.arg, {
            sync: () => {
            }
        });

    }

}

export default Set;
