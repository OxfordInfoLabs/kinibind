/**
 * Toggle class
 */
let Toggle = {


    publishes: true,


    bind: function (el) {

        let observer = this.observer;

        let toggleValues = null;
        if (el.getAttribute("toggle-values")) {
            toggleValues = el.getAttribute("toggle-values").split(",");
        }

        if (!this.callback) {
            this.callback = function (event) {
                event.stopPropagation();

                if (toggleValues) {
                    let position = toggleValues.indexOf(observer.value());
                    position++;
                    position = position % toggleValues.length;
                    observer.setValue(toggleValues[position]);
                } else {
                    observer.setValue(!observer.value());
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
