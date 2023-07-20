import tinybind from "tinybind";

/**
 * Toggle class
 */
let Has = {

    priority: 4000,

    // Simply update the model value
    routine: function (el, value) {

        if (value) {
            el.setAttribute(this.arg, '');
        } else {
            el.removeAttribute(this.arg);
        }

    }

}

export default Has;