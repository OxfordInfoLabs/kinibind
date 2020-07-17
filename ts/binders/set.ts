import tinybind from "tinybind";

/**
 * Toggle class
 */
let Set = {

    // Simply update the model value
    routine: function (el, value) {

        this.view.models[this.arg] = value;

        // Observe the new property
        tinybind.adapters[tinybind.rootInterface].observe(this.view.models, this.arg, {
            sync: () => {
            }
        });

    }

}

export default Set;
