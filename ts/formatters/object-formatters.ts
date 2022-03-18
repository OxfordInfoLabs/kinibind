/**
 * Object operation formatters
 */

let ObjectFormatters = {

    member: {
        read: function (value, member) {
            return value ? value[member] : null;
        }
    },

    keys: function (value) {
        return value ? Object.keys(value) : [];
    },

    values: function (value) {
        if (value) {
            let values = [];
            Object.keys(value).forEach(key => {
                values.push(value[key]);
            })
            return values;
        } else {
            return [];
        }
    },

    // Combine multiple objects using their members via the spread operator
    combine: function (value) {
        let object = {...value};
        for (var arg = 1; arg < arguments.length; arg++) {
            if (typeof arguments[arg] == "object")
                object = {...object, ...arguments[arg]};
        }
        return object;
    },

    // Wrap an object as an array
    wrapAsArray: function (value) {
        if (value instanceof Array) {
            return value;
        } else {
            return [value];
        }
    }


}

export default ObjectFormatters;
