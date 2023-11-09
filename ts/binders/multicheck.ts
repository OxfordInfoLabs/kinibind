/**
 * Multi Check class
 */
let MultiCheck: any = {


    publishes: true,


    bind: function (el: any) {

        let observer = this.observer;

        if (!this.callback) {
            this.callback = function (event: any) {
                let checkedValues: any = [];
                el.querySelectorAll("input[type='checkbox']").forEach((checkbox: any) => {
                    if (checkbox.checked && checkbox.dataset.value) {
                        checkedValues.push(checkbox.dataset.value);
                    }
                });

                observer.setValue(checkedValues.length ? checkedValues : null);
            };
        }

        // Initialise values
        let checkedValues = observer.value() || [];
        el.querySelectorAll("input[type='checkbox']").forEach((checkbox: any) => {
            checkbox.checked = checkedValues.includes(checkbox.dataset.value);
        });

        // Ensure we update checked items on dom modifications
        el.addEventListener("DOMSubtreeModified", ((event: any) => {
            let checkedValues = observer.value() || [];
            el.querySelectorAll("input[type='checkbox']").forEach((checkbox: any) => {
                checkbox.checked = checkedValues.includes(checkbox.dataset.value);
            });
        }));

        el.addEventListener("change", this.callback);

    },

    unbind: function (el: any) {
        el.removeEventListener("change", this.callback);
    }


}

export default MultiCheck;
