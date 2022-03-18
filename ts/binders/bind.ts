/**
 * Toggle class
 */

import Kinibind from "../kinibind";


let Bind = {

    block: true,
    priority: 4000,

    bind: function (el) {

        if (!this.marker) {
            this.marker = document.createComment(' tinybind: ' + this.type);
            this.attached = false

            el.parentNode.insertBefore(this.marker, el)
            el.parentNode.removeChild(el)
        } else if (this.bound === false && this.nested) {
            this.nested.bind()
        }
        this.bound = true
    },

    unbind: function () {
        if (this.nested) {
            this.nested.unbind()
            this.bound = false
        }
    },

    // Simply update the model value
    routine: function (el, value, cloneParentModel = true) {

        if (value) {
            el.innerHTML = value;
        }

        // Create a clone of the model
        let nestedModel = cloneParentModel ? {...this.view.models} : this.view.models;

        // Create a new kinibind context
        this.kinibind = new Kinibind(el, nestedModel);
        this.nested = this.kinibind.boundContext;

        this.marker.parentNode.insertBefore(el, this.marker.nextSibling);
        this.attached = true;


        return nestedModel;

    },

    update: function (models) {

        if (this.nested) {
            this.nested.update({...models});
        }


    }


}

export default Bind;
