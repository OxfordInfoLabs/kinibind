/**
 * Toggle class
 */
let SetContext: any = {

    priority: 5000,

    // Simply update the model value
    routine: function (el: any, value: any) {

        if (!el.kinibindSetContexts) {
            el.kinibindSetContexts = {};
        }

        // Convert hyphenated form to camel case for variable names
        let variableName = this.arg.replace(/-([a-z])/g, function (g: any) {
            return g[1].toUpperCase();
        });


        el.kinibindSetContexts[variableName] = value;

    }

}

export default SetContext;