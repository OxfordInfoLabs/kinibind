import * as tinybind from "tinybind";
/**
 * Toggle class
 */
let Set = {

    priority: 4000,

    // Simply update the model value
    routine: function (el: any, value: any) {

        // Convert hyphenated form to camel case for variable names
        let variableName: any = (<any>this).arg.replace(/-([a-z])/g, function (g: any) {
            return g[1].toUpperCase();
        });

        let model = el.kinibindSetContexts && el.kinibindSetContexts[variableName] ? el.kinibindSetContexts[variableName] : (<any>this).view.models;
        model[variableName] = value;

        // Observe the new property
        tinybind.adapters[tinybind.rootInterface].observe(model, variableName, {
            sync: () => {
            }
        });


    }

}

export default Set;
