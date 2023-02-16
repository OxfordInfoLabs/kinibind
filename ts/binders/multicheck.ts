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
                    if (checkbox.checked && checkbox.dataset.value){
                        checkedValues.push(checkbox.dataset.value);
                    }
                });

                observer.setValue(checkedValues.length ? checkedValues : null);
            };
        }

        el.addEventListener("change", this.callback);

    },

    unbind: function (el) {
        el.removeEventListener("change", this.callback);
    }


}

export default MultiCheck;
