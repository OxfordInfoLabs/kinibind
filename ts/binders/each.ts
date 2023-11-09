import ArrayProxy from "../proxy/array-proxy";

export default function Each(eachBinder: any) {

    eachBinder.coreRoutine = eachBinder.routine;

    // Overload the existing logic to be tolerant about non array input.
    eachBinder.routine = function (el: any, collection: any) {

        if (!Array.isArray(collection) && !(collection instanceof ArrayProxy)) {
            collection = [];
        }

        return eachBinder.coreRoutine.call(this, el, collection);
    };

    return eachBinder;

}
