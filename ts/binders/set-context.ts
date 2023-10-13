import tinybind from "tinybind";

/**
 * Toggle class
 */
let SetContext = {

    priority: 5000,

    // Simply update the model value
    routine: function (el, value) {

        if (!el.kinibindSetContexts) {
            el.kinibindSetContexts = {};
        }

        // Convert hyphenated form to camel case for variable names
        let variableName = this.arg.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
        });


        el.kinibindSetContexts[variableName] = value;

    }

}

export default SetContext;