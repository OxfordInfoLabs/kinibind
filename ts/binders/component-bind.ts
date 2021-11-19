/**
 * Toggle class
 */

import Bind from "./bind";
import Kinibind from "../kinibind";

let ComponentBind = {

    block: true,
    priority: 4000,

    // Share bind and unbind logic with bind binder
    bind: Bind.bind,
    unbind: Bind.unbind,

    // Call bind logic and
    routine: function (el, value) {

        this.marker.parentNode.insertBefore(el, this.marker.nextSibling);

        let kinibind = Bind.routine.call(this, el, null);

        if (Kinibind.components[this.arg]) {
            let constructor = Kinibind.components[this.arg];
            new constructor(el, kinibind);
        }



    },

    // Share update logic with bind
    update: Bind.update
}

export default ComponentBind;
