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


        const mutationObserver = new MutationObserver(mutationList =>
            mutationList.filter(m => m.type === 'childList').forEach(m => {
                let checkedValues = observer.value() || [];
                el.querySelectorAll("input[type='checkbox']").forEach((checkbox: any) => {
                    checkbox.checked = checkedValues.includes(checkbox.dataset.value);
                });
            }));
        mutationObserver.observe(el, {childList: true, subtree: true});

        el.addEventListener("change", this.callback);

    },

    unbind: function (el: any) {
        el.removeEventListener("change", this.callback);
    }


}

export default MultiCheck;
