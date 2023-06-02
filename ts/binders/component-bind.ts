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
        let componentModel = Bind.bind.call(this, el);

        // Capture parent model and remove to clean component model
        let parentModel = componentModel.parent;
        componentModel['$parent'] = parentModel;
        delete componentModel.parent;

        if (Kinibind.components[this.arg] && el.ownerDocument) {
            let constructor = Kinibind.components[this.arg];
            new constructor(el, componentModel, parentModel, el.ownerDocument);
        }
    }

}

export default ComponentBind;
