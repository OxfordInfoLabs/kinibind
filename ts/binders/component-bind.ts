/**
 * Toggle class
 */

import Kinibind from "../kinibind";

let ComponentBind: any = {

    block: true,
    priority: 4000,

    // Call bind logic and
    bind: function (el: any) {

        // Create a clean model
        let model: any = {'$global': (<any>this).view.models['$global'] || (<any>this).view.models};

        (<any>window)["tinybind"].bind(el, model);

        // Sort out parent and global models
        model['$parent'] = (<any>this).view.models;

        if ((<any>Kinibind.components)[this.arg] && el.ownerDocument) {
            let constructor = (<any>Kinibind.components)[this.arg];
            new constructor(el, model, (<any>this).view.models, el.ownerDocument);
        }

        el.dataset.kinibound = "1";
        el.boundModel = model;

    }

}

export default ComponentBind;
