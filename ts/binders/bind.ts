/**
 * Toggle class
 */


let Bind = {

    block: true,
    priority: 4000,

    bind: function (el: any) {

        // Create a clean model
        let model: any = {'$global': (<any>this).view.models['$global'] || (<any>this).view.models};

        (<any>window)["tinybind"].bind(el, model);

        // Sort out parent and global model
        model['$parent'] = (<any>this).view.models;

        el.dataset.kinibound = "1";
        el.boundModel = model;

        return model;
    }

}

export default Bind;
