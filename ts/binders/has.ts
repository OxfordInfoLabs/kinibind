/**
 * Toggle class
 */
let Has: any = {

    priority: 4000,

    // Simply update the model value
    routine: function (el: any, value: any) {

        if (value) {
            el.setAttribute(this.arg, '');
        } else {
            el.removeAttribute(this.arg);
        }

    }

}

export default Has;