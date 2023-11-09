/**
 * Toggle class
 */
let Toggle: any = {


    publishes: true,


    bind: function (el: any) {

        let observer: any = this.observer;

        if (!this.callback) {
            this.callback = function (event: any) {

                // if special initialise object toggle mode initialise the object
                if (el.getAttribute("initialise-object")) {
                    observer.setValue({});
                } else {

                    let toggleValues:any = null;
                    if (el.getAttribute("toggle-values")) {
                        toggleValues = el.getAttribute("toggle-values").split(",");
                    }

                    if (toggleValues) {
                        let position = toggleValues.indexOf(observer.value());
                        position++;
                        position = position % toggleValues.length;

                        let value = toggleValues[position].trim();
                        if (value == "true") {
                            value = true;
                        } else if (value == "false") {
                            value = false;
                        }

                        observer.setValue(value);
                    } else {
                        observer.setValue(!observer.value());
                    }
                }
            };
        }

        let toggleEvent = el.getAttribute("toggle-event") ? el.getAttribute("toggle-event") : "click";

        el.addEventListener(toggleEvent, this.callback);

    },

    unbind: function (el: any) {
        el.removeEventListener("click", this.callback);
    }


}

export default Toggle;
