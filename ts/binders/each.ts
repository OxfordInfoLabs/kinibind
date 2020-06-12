export default function Each(eachBinder) {

    eachBinder.coreRoutine = eachBinder.routine;

    // Overload the existing logic to be tolerant about non array input.
    eachBinder.routine = function (el, collection) {

        if (!Array.isArray(collection)) {
            collection = [];
        }

        return eachBinder.coreRoutine.call(this, el, collection);
    };

    return eachBinder;

}
