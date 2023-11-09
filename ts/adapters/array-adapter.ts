/**
 * Array adapter - handles mapping of expressions with [] in.
 */
let ArrayAdapter = {

    observe: function (obj: any, keypath: any, callback: any) {
        keypath = keypath.substr(0, keypath.length - 1).replace(/'/g, '').replace(/"/g, '');
        if (obj.on)
            obj.on('change:' + keypath, callback);
    },

    unobserve: function (obj: any, keypath: any, callback: any) {
        keypath = keypath.substr(0, keypath.length - 1).replace(/'/g, '').replace(/"/g, '');
        if (obj.off)
            obj.off('change:' + keypath, callback);
    },

    get: function (obj: any, keypath: any) {
        keypath = keypath.substr(0, keypath.length - 1).replace(/'/g, '').replace(/"/g, '');
        return obj[keypath];
    },

    set: function (obj: any, keypath: any, value: any) {
        keypath = keypath.substr(0, keypath.length - 1).replace(/'/g, '').replace(/"/g, '');
        obj[keypath] = value;
    }
}

export default ArrayAdapter;
