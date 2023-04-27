/**
 * Toggle class
 */

import Bind from "./bind";
import Kinibind from "../kinibind";

let ComponentBind = {

    block: true,
    priority: 4000,

    // Call bind logic and
    bind: function (el) {
        let model = Bind.bind.call(this, el);

        if (Kinibind.components[this.arg] && el.ownerDocument) {
            let constructor = Kinibind.components[this.arg];
            new constructor(el, model, el.ownerDocument);
        }
    }

}

export default ComponentBind;
