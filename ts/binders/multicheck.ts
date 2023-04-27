/**
 * Multi Check class
 */
let MultiCheck = {


    publishes: true,


    bind: function (el) {

        let observer = this.observer;

        if (!this.callback) {
            this.callback = function (event) {
                let checkedValues = [];
                el.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
                    if (checkbox.checked && checkbox.dataset.value) {
                        checkedValues.push(checkbox.dataset.value);
                    }
                });

                observer.setValue(checkedValues.length ? checkedValues : null);
            };
        }

        // Initialise values
        let checkedValues = observer.value() || [];
        el.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
            checkbox.checked = checkedValues.includes(checkbox.dataset.value);
        });

        // Ensure we update checked items on dom modifications
        el.addEventListener("DOMSubtreeModified", (event => {
            let checkedValues = observer.value() || [];
            el.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
                checkbox.checked = checkedValues.includes(checkbox.dataset.value);
            });
        }));

        el.addEventListener("change", this.callback);

    },

    unbind: function (el) {
        el.removeEventListener("change", this.callback);
    }


}

export default MultiCheck;
