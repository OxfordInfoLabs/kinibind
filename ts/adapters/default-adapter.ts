/**
 * Override the observe method to always observe objects all the way back up the tree.
 *
 */
let DefaultAdapter = {

    observe: function observe(obj, keypath, callback) {

        var _this2 = this;

        var value;
        var callbacks = this.weakReference(obj).callbacks;

        if (!callbacks[keypath]) {


            callbacks[keypath] = [];
            var desc = Object.getOwnPropertyDescriptor(obj, keypath);


            if (!desc || !(desc.get || desc.set || !desc.configurable)) {
                value = obj[keypath];


                Object.defineProperty(obj, keypath, {
                    enumerable: true,
                    get: function get() {
                        return value;
                    },
                    set: function set(newValue) {

                        if ((typeof newValue == 'object') || (newValue !== value)) {

                            _this2.unobserveArray(value, obj.__rv, keypath);

                            value = newValue;

                            var data = _this2.weakmap[obj.__rv];

                            if (data) {

                                // Run all callbacks
                                _this2.runCallbacks(obj, keypath, _this2);

                                // Observe array for new values
                                _this2.observeArray(newValue, obj.__rv, keypath);
                            }

                            // Observe recursively
                            _this2.observeObject(newValue, _this2);
                        }

                    }
                });

            }


        }

        // Ensure we set up parent object structure for firing parent events when children change or are added.
        if (typeof (obj[keypath]) === 'object' && !(obj[keypath] instanceof Array) && obj[keypath] !== null) {

            if (keypath.substr(0, 8) != "__parent") {
                let data = this.weakReference(obj[keypath]);
                if (!data.parentObject) {
                    data.parentObject = obj;
                    data.keypath = keypath;
                }
            }
        }

        if (callbacks[keypath].indexOf(callback) === -1) {
            callbacks[keypath].push(callback);
        }


        this.observeArray(obj[keypath], obj.__rv, keypath);


    },
    observeObject: function (object, observer) {
        // Recursively observe new items.
        if (typeof object === 'object') {

            for (var key in object) {

                if (key !== "constructor") {

                    observer.observe(object, key, {
                        sync: () => {
                        }
                    });

                }

                if (key.substr(0, 8) != "__parent") {
                    observer.observeObject(object[key], observer);
                }

            }
        }
    },
    runCallbacks: function (object, keypath, observer) {

        var data = observer.weakmap[object.__rv];

        var _callbacks = data.callbacks[keypath];

        if (_callbacks) {
            _callbacks.forEach(function (cb) {
                cb.sync();
            });
        }


        // Call parent updates
        let parentData = observer.weakReference(object);
        if (parentData.parentObject) {
            if (parentData.keypath.substr(0, 8) != "__parent") {
                observer.runCallbacks(parentData.parentObject, parentData.keypath, observer);
            }
        }


    }
};

export default DefaultAdapter;
