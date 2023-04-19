/**
 * Toggle class
 */
let Toggle = {


    publishes: true,


    bind: function (el) {

        let observer = this.observer;

        if (!this.callback) {
            this.callback = function (event) {

                // if special initialise object toggle mode initialise the object
                if (el.getAttribute("initialise-object")) {
                    observer.setValue({});
                } else {

                    let toggleValues = null;
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

    unbind: function (el) {
        el.removeEventListener("click", this.callback);
    }


}

export default Toggle;
